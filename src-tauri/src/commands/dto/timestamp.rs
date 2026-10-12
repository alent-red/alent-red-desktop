use std::fmt::Write;

use crate::error::{AppError, AppResult};

const SECS_PER_DAY: i64 = 86_400;
const NANOS_PER_SEC: i32 = 1_000_000_000;
const SECS_PER_HOUR: i64 = 3_600;
const SECS_PER_MINUTE: i64 = 60;

// Days-to-Y/M/D algorithm: Howard Hinnant's `civil_from_days`
// (https://howardhinnant.github.io/date_algorithms.html). Constants are
// algorithm artifacts, not configuration.
const DAYS_FROM_0000_TO_1970: i64 = 719_468;
const DAYS_PER_ERA: i64 = 146_097;
const ERA_OFFSET: i64 = 146_096;
const DAYS_PER_400_YEARS: i64 = 146_097;
const DAYS_PER_1460: u64 = 1_460;
const DAYS_PER_CENTURY_QUOTIENT: u64 = 36_524;
const DAYS_PER_QUARTER_MILLENIUM_QUOTIENT: u64 = 146_096;
const DAYS_PER_AVERAGE_YEAR: u64 = 365;
const DAYS_PER_MONTH_NUMERATOR: u64 = 153;

pub(super) fn timestamp_to_iso(timestamp: &prost_types::Timestamp) -> AppResult<String> {
    let seconds = timestamp.seconds;
    let raw_nanos = timestamp.nanos;
    if !(0..NANOS_PER_SEC).contains(&raw_nanos) {
        return Err(AppError::invalid_response(format!(
            "Timestamp nanos out of range: {raw_nanos}"
        )));
    }
    let Ok(nanos) = u32::try_from(raw_nanos) else {
        return Err(AppError::invalid_response(format!(
            "Timestamp nanos cannot be represented as u32: {raw_nanos}"
        )));
    };
    let days = seconds.div_euclid(SECS_PER_DAY);
    let secs_of_day = seconds.rem_euclid(SECS_PER_DAY);
    let Some((year, month, day)) = days_to_ymd(days) else {
        return Err(AppError::invalid_response(format!(
            "Timestamp days out of representable range: {days}"
        )));
    };
    let Ok(hour) = u32::try_from(secs_of_day / SECS_PER_HOUR) else {
        return Err(AppError::invalid_response(format!(
            "Timestamp hour overflow: {secs_of_day}"
        )));
    };
    let Ok(minute) = u32::try_from((secs_of_day % SECS_PER_HOUR) / SECS_PER_MINUTE) else {
        return Err(AppError::invalid_response(format!(
            "Timestamp minute overflow: {secs_of_day}"
        )));
    };
    let Ok(second) = u32::try_from(secs_of_day % SECS_PER_MINUTE) else {
        return Err(AppError::invalid_response(format!(
            "Timestamp second overflow: {secs_of_day}"
        )));
    };
    let mut out = String::with_capacity(30);
    let _ = write!(
        out,
        "{year:04}-{month:02}-{day:02}T{hour:02}:{minute:02}:{second:02}.{nanos:09}Z"
    );
    Ok(out)
}

fn days_to_ymd(days: i64) -> Option<(i32, u32, u32)> {
    let z = days.checked_add(DAYS_FROM_0000_TO_1970)?;
    let era = if z >= 0 { z } else { z - ERA_OFFSET } / DAYS_PER_400_YEARS;
    let doe = u64::try_from(z - era * DAYS_PER_ERA).ok()?;
    let yoe = (doe - doe / DAYS_PER_1460 + doe / DAYS_PER_CENTURY_QUOTIENT
        - doe / DAYS_PER_QUARTER_MILLENIUM_QUOTIENT)
        / DAYS_PER_AVERAGE_YEAR;
    let y = i64::try_from(yoe).ok()?.checked_add(era * 400)?;
    let doy = doe - (DAYS_PER_AVERAGE_YEAR * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / DAYS_PER_MONTH_NUMERATOR;
    let d = doy - (DAYS_PER_MONTH_NUMERATOR * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let year_offset = i64::from(m <= 2);
    let year = i32::try_from(y.checked_add(year_offset)?).ok()?;
    let month = u32::try_from(m).ok()?;
    let day = u32::try_from(d).ok()?;
    Some((year, month, day))
}

pub(super) fn convert_timestamp(
    field_name: &'static str,
    proto_field: Option<prost_types::Timestamp>,
) -> AppResult<String> {
    let timestamp = proto_field.ok_or_else(|| {
        AppError::invalid_response(format!(
            "Required timestamp field `{field_name}` is missing"
        ))
    })?;
    timestamp_to_iso(&timestamp)
}
