import { useTransportStore } from '@/features/transport/stores/transport-store';
import { translate } from '@/shared/i18n/translate';
import {
  setTransportFailureReporter,
  type TransportFailureReporter,
} from '@/shared/invoke/transport-failure-reporter';

const reporter: TransportFailureReporter = (error, command): void => {
  useTransportStore
    .getState()
    .markFailed(error.detail ?? translate('transport.errorDuringCommand', { command }));
};

export function registerTransportFailureReporter(): void {
  setTransportFailureReporter(reporter);
}
