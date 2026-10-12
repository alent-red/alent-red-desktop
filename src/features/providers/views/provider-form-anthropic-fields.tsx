import * as React from 'react';

import { ANTHROPIC_CACHE_TTL_OPTIONS } from '@/features/providers/constants/anthropic-cache-ttl-options';
import { type AnthropicCacheTtl } from '@/features/providers/types/anthropic-cache-ttl';
import { translate } from '@/shared/i18n/translate';
import { Label } from '@/shared/views/label';
import { NumberField } from '@/shared/views/number-field';
import { Select } from '@/shared/views/select';
import { SelectContent } from '@/shared/views/select-content';
import { SelectItem } from '@/shared/views/select-item';
import { SelectTrigger } from '@/shared/views/select-trigger';
import { SelectValue } from '@/shared/views/select-value';

export interface AnthropicFieldValues {
  reasoningMinimal: number;
  reasoningLow: number;
  reasoningMedium: number;
  reasoningHigh: number;
  reasoningXhigh: number;
  cacheMediumTtl: AnthropicCacheTtl;
  cacheHighTtl: AnthropicCacheTtl;
}

export interface AnthropicFieldErrors {
  reasoningMinimal: string | null;
  reasoningLow: string | null;
  reasoningMedium: string | null;
  reasoningHigh: string | null;
  reasoningXhigh: string | null;
}

interface ProviderFormAnthropicFieldsProps {
  values: AnthropicFieldValues;
  errors: AnthropicFieldErrors;
  isPending: boolean;
  onReasoningMinimalChange: (value: number) => void;
  onReasoningLowChange: (value: number) => void;
  onReasoningMediumChange: (value: number) => void;
  onReasoningHighChange: (value: number) => void;
  onReasoningXhighChange: (value: number) => void;
  onCacheMediumTtlChange: (value: AnthropicCacheTtl) => void;
  onCacheHighTtlChange: (value: AnthropicCacheTtl) => void;
  onReasoningMinimalBlur: () => void;
  onReasoningLowBlur: () => void;
  onReasoningMediumBlur: () => void;
  onReasoningHighBlur: () => void;
  onReasoningXhighBlur: () => void;
}

export const ProviderFormAnthropicFields = ({
  values,
  errors,
  isPending,
  onReasoningMinimalChange,
  onReasoningLowChange,
  onReasoningMediumChange,
  onReasoningHighChange,
  onReasoningXhighChange,
  onCacheMediumTtlChange,
  onCacheHighTtlChange,
  onReasoningMinimalBlur,
  onReasoningLowBlur,
  onReasoningMediumBlur,
  onReasoningHighBlur,
  onReasoningXhighBlur,
}: ProviderFormAnthropicFieldsProps): React.ReactElement => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <NumberField
        label={translate('providers.reasoningMinimalLabel')}
        value={values.reasoningMinimal}
        onChange={onReasoningMinimalChange}
        onBlur={onReasoningMinimalBlur}
        error={errors.reasoningMinimal}
        isDisabled={isPending}
      />
      <NumberField
        label={translate('providers.reasoningLowLabel')}
        value={values.reasoningLow}
        onChange={onReasoningLowChange}
        onBlur={onReasoningLowBlur}
        error={errors.reasoningLow}
        isDisabled={isPending}
      />
      <NumberField
        label={translate('providers.reasoningMediumLabel')}
        value={values.reasoningMedium}
        onChange={onReasoningMediumChange}
        onBlur={onReasoningMediumBlur}
        error={errors.reasoningMedium}
        isDisabled={isPending}
      />
      <NumberField
        label={translate('providers.reasoningHighLabel')}
        value={values.reasoningHigh}
        onChange={onReasoningHighChange}
        onBlur={onReasoningHighBlur}
        error={errors.reasoningHigh}
        isDisabled={isPending}
      />
      <NumberField
        label={translate('providers.reasoningXhighLabel')}
        value={values.reasoningXhigh}
        onChange={onReasoningXhighChange}
        onBlur={onReasoningXhighBlur}
        error={errors.reasoningXhigh}
        isDisabled={isPending}
      />
      <div className="flex flex-col gap-1">
        <Label>{translate('providers.cacheMediumTtlLabel')}</Label>
        <Select
          value={values.cacheMediumTtl}
          onValueChange={(value): void => {
            onCacheMediumTtlChange(value as AnthropicCacheTtl);
          }}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANTHROPIC_CACHE_TTL_OPTIONS.map(
              (option): React.ReactElement => (
                <SelectItem key={option.value} value={option.value}>
                  {translate(option.labelKey)}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <Label>{translate('providers.cacheHighTtlLabel')}</Label>
        <Select
          value={values.cacheHighTtl}
          onValueChange={(value): void => {
            onCacheHighTtlChange(value as AnthropicCacheTtl);
          }}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANTHROPIC_CACHE_TTL_OPTIONS.map(
              (option): React.ReactElement => (
                <SelectItem key={option.value} value={option.value}>
                  {translate(option.labelKey)}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
