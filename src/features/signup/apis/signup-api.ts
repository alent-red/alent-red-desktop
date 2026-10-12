import type { Signup } from '@/features/signup/types/signup';

// Supabase project URL + publishable key. Publishable keys (sb_publishable_*)
// are the new format that replaces the legacy anon JWT — both work in 2026 but
// the publishable variant is the forward path. The key is intentionally public
// in Supabase's threat model; security is enforced by Row Level Security on
// the `leads` table (INSERT-only for the `anon` role, no SELECT / UPDATE /
// DELETE).
const SUPABASE_URL = 'https://ccjbifoputgsepoflevw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-DqtYnvSgZ3cBXlPxT5-6g_x8E01aa5';

interface SignupRow {
  kind: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  company_name: string | null;
  app_version: string;
  desktop_id: string;
}

function toRow(signup: Signup): SignupRow {
  return {
    kind: signup.kind,
    first_name: signup.firstName,
    last_name: signup.lastName,
    email: signup.email,
    country_code: signup.countryCode,
    company_name: signup.companyName,
    app_version: signup.appVersion,
    desktop_id: signup.desktopId,
  };
}

export async function pushSignup(signup: Signup): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(toRow(signup)),
  });
  if (!response.ok) {
    const detail = await response.text().catch((): string => '');
    throw new Error(`Supabase insert failed (${String(response.status)}): ${detail}`);
  }
}
