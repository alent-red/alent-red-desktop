import { BRICK_KIND_ICON } from '@/features/bricks/constants/brick-kind-icon';
import { BRICK_KIND_LABEL_KEY } from '@/features/bricks/constants/brick-kind-label-key';
import { BrickConfigType } from '@/features/bricks/types/brick-config-type';
import type { KindOption } from '@/shared/views/kind-picker';

export const BRICK_KIND_OPTIONS: KindOption<BrickConfigType>[] = [
  {
    value: BrickConfigType.Ui,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Ui],
    icon: BRICK_KIND_ICON[BrickConfigType.Ui],
  },
  {
    value: BrickConfigType.Vision,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Vision],
    icon: BRICK_KIND_ICON[BrickConfigType.Vision],
  },
  {
    value: BrickConfigType.System,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.System],
    icon: BRICK_KIND_ICON[BrickConfigType.System],
  },
  {
    value: BrickConfigType.Code,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Code],
    icon: BRICK_KIND_ICON[BrickConfigType.Code],
  },
  {
    value: BrickConfigType.Scheduler,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Scheduler],
    icon: BRICK_KIND_ICON[BrickConfigType.Scheduler],
  },
  {
    value: BrickConfigType.Skills,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Skills],
    icon: BRICK_KIND_ICON[BrickConfigType.Skills],
  },
  {
    value: BrickConfigType.Browser,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Browser],
    icon: BRICK_KIND_ICON[BrickConfigType.Browser],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
  {
    value: BrickConfigType.Agent,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Agent],
    icon: BRICK_KIND_ICON[BrickConfigType.Agent],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
  {
    value: BrickConfigType.Renderer,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Renderer],
    icon: BRICK_KIND_ICON[BrickConfigType.Renderer],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
  {
    value: BrickConfigType.Custom,
    labelKey: BRICK_KIND_LABEL_KEY[BrickConfigType.Custom],
    icon: BRICK_KIND_ICON[BrickConfigType.Custom],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
];
