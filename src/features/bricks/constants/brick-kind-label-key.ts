import { BrickConfigType } from '@/features/bricks/types/brick-config-type';
import type { TranslationKey } from '@/shared/i18n/translate';

export const BRICK_KIND_LABEL_KEY: Record<BrickConfigType, TranslationKey> = {
  [BrickConfigType.Ui]: 'bricks.kindLabelUi',
  [BrickConfigType.Vision]: 'bricks.kindLabelVision',
  [BrickConfigType.Skills]: 'bricks.kindLabelSkills',
  [BrickConfigType.Browser]: 'bricks.kindLabelBrowser',
  [BrickConfigType.System]: 'bricks.kindLabelSystem',
  [BrickConfigType.Code]: 'bricks.kindLabelCode',
  [BrickConfigType.Scheduler]: 'bricks.kindLabelScheduler',
  [BrickConfigType.Agent]: 'bricks.kindLabelAgent',
  [BrickConfigType.Renderer]: 'bricks.kindLabelRenderer',
  [BrickConfigType.Custom]: 'bricks.kindLabelCustom',
};
