import * as React from 'react';

import { Briefcase, User } from 'lucide-react';

import { submitSignup } from '@/features/signup/actions/submit-signup';
import { COUNTRIES } from '@/features/signup/constants/countries';
import { validateEmail } from '@/features/signup/lib/validate-email';
import { SignupKind } from '@/features/signup/types/signup-kind';
import { useFieldErrors } from '@/shared/hooks/use-field-errors';
import { translate } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';
import { validateTrimmedNonEmpty } from '@/shared/lib/validate-trimmed-non-empty';
import { Button } from '@/shared/views/button';
import { Combobox, type ComboboxOption } from '@/shared/views/combobox';
import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';
import { KindPicker, type KindOption } from '@/shared/views/kind-picker';
import { Label } from '@/shared/views/label';
import { Spinner } from '@/shared/views/spinner';

interface SignupFormValues {
  kind: SignupKind | null;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  companyName: string;
}

const KIND_OPTIONS: KindOption<SignupKind>[] = [
  { value: SignupKind.Individual, labelKey: 'signup.kindIndividual', icon: User },
  { value: SignupKind.Company, labelKey: 'signup.kindCompany', icon: Briefcase },
];

const INITIAL_VALUES: SignupFormValues = {
  kind: null,
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '',
  companyName: '',
};

const COUNTRY_OPTIONS: ComboboxOption[] = COUNTRIES.map(
  (country): ComboboxOption => ({
    value: country.code,
    label: `${country.flag} ${country.name}`,
  }),
);

function validate(values: SignupFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.kind === null) {
    errors['kind'] = translate('signup.errorKindRequired');
  }
  const firstNameError = validateTrimmedNonEmpty(values.firstName);
  if (firstNameError !== null) {
    errors['firstName'] = firstNameError;
  }
  const lastNameError = validateTrimmedNonEmpty(values.lastName);
  if (lastNameError !== null) {
    errors['lastName'] = lastNameError;
  }
  const emailError = validateEmail(values.email);
  if (emailError !== null) {
    errors['email'] = emailError;
  }
  if (values.countryCode.length === 0) {
    errors['countryCode'] = translate('signup.errorCountryRequired');
  }
  if (values.kind === SignupKind.Company) {
    const companyError = validateTrimmedNonEmpty(values.companyName);
    if (companyError !== null) {
      errors['companyName'] = companyError;
    }
  }
  return errors;
}

export const SignupForm = (): React.ReactElement => {
  const [values, setValues] = React.useState<SignupFormValues>(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasActivationFailed, setHasActivationFailed] = React.useState(false);
  const fieldErrors = useFieldErrors(values, validate);

  const isCompany = values.kind === SignupKind.Company;

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    fieldErrors.touchAll();
    if (!fieldErrors.isValid || isSubmitting) {
      return;
    }
    const kind = values.kind;
    if (kind === null) {
      return;
    }
    const run = async (): Promise<void> => {
      setIsSubmitting(true);
      setHasActivationFailed(false);
      try {
        await submitSignup({
          kind,
          firstName: trimSpaces(values.firstName),
          lastName: trimSpaces(values.lastName),
          email: trimSpaces(values.email),
          countryCode: values.countryCode,
          companyName: isCompany ? trimSpaces(values.companyName) : null,
        });
      } catch {
        setHasActivationFailed(true);
        setIsSubmitting(false);
      }
    };
    void run();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <Label>{translate('signup.kindLabel')}</Label>
        <KindPicker
          options={KIND_OPTIONS}
          value={values.kind}
          onChange={(next): void => {
            setValues((current): SignupFormValues => ({ ...current, kind: next }));
          }}
        />
        <FieldError message={fieldErrors.errorFor('kind')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-first-name">{translate('signup.firstNameLabel')}</Label>
          <Input
            id="signup-first-name"
            value={values.firstName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setValues(
                (current): SignupFormValues => ({
                  ...current,
                  firstName: event.target.value,
                }),
              );
            }}
            onBlur={(): void => {
              fieldErrors.touch('firstName');
            }}
            isInvalid={Boolean(fieldErrors.errorFor('firstName'))}
            autoComplete="given-name"
          />
          <FieldError message={fieldErrors.errorFor('firstName')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-last-name">{translate('signup.lastNameLabel')}</Label>
          <Input
            id="signup-last-name"
            value={values.lastName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setValues(
                (current): SignupFormValues => ({
                  ...current,
                  lastName: event.target.value,
                }),
              );
            }}
            onBlur={(): void => {
              fieldErrors.touch('lastName');
            }}
            isInvalid={Boolean(fieldErrors.errorFor('lastName'))}
            autoComplete="family-name"
          />
          <FieldError message={fieldErrors.errorFor('lastName')} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">{translate('signup.emailLabel')}</Label>
        <Input
          id="signup-email"
          type="email"
          value={values.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setValues((current): SignupFormValues => ({ ...current, email: event.target.value }));
          }}
          onBlur={(): void => {
            fieldErrors.touch('email');
          }}
          isInvalid={Boolean(fieldErrors.errorFor('email'))}
          autoComplete="email"
        />
        <FieldError message={fieldErrors.errorFor('email')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{translate('signup.countryLabel')}</Label>
        <Combobox
          options={COUNTRY_OPTIONS}
          value={values.countryCode.length === 0 ? null : values.countryCode}
          onChange={(next): void => {
            setValues((current): SignupFormValues => ({ ...current, countryCode: next }));
            fieldErrors.touch('countryCode');
          }}
          placeholder={translate('signup.countryPlaceholder')}
          searchPlaceholder={translate('signup.countrySearchPlaceholder')}
          isInvalid={Boolean(fieldErrors.errorFor('countryCode'))}
        />
        <FieldError message={fieldErrors.errorFor('countryCode')} />
      </div>

      {isCompany ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-company-name">{translate('signup.companyNameLabel')}</Label>
          <Input
            id="signup-company-name"
            value={values.companyName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setValues(
                (current): SignupFormValues => ({
                  ...current,
                  companyName: event.target.value,
                }),
              );
            }}
            onBlur={(): void => {
              fieldErrors.touch('companyName');
            }}
            isInvalid={Boolean(fieldErrors.errorFor('companyName'))}
            autoComplete="organization"
          />
          <FieldError message={fieldErrors.errorFor('companyName')} />
        </div>
      ) : null}

      {hasActivationFailed ? (
        <div
          role="alert"
          className="rounded-[8px] border border-[var(--color-danger)] bg-[var(--color-danger-bg)] px-3 py-2 text-[12.5px] text-[var(--color-danger)]"
        >
          <div className="font-medium">{translate('signup.activationFailedTitle')}</div>
          <div>{translate('signup.activationFailedBody')}</div>
        </div>
      ) : null}
      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full mt-1">
        {isSubmitting ? (
          <>
            <Spinner size={13} className="text-current" />
            {translate('signup.submittingLabel')}
          </>
        ) : (
          translate('signup.submitButton')
        )}
      </Button>
    </form>
  );
};
