import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Bot,
  Clock,
  Code2,
  Eye,
  Globe,
  Image as ImageIcon,
  MousePointerClick,
  Terminal,
  Wrench,
} from 'lucide-react';

import { BrickConfigType } from '@/features/bricks/types/brick-config-type';

export const BRICK_KIND_ICON: Record<BrickConfigType, LucideIcon> = {
  [BrickConfigType.Ui]: MousePointerClick,
  [BrickConfigType.Vision]: Eye,
  [BrickConfigType.Skills]: BookOpen,
  [BrickConfigType.Browser]: Globe,
  [BrickConfigType.System]: Terminal,
  [BrickConfigType.Code]: Code2,
  [BrickConfigType.Scheduler]: Clock,
  [BrickConfigType.Agent]: Bot,
  [BrickConfigType.Renderer]: ImageIcon,
  [BrickConfigType.Custom]: Wrench,
};
