import type { ComponentType } from 'react';

import {
  BellOff,
  BellPlus,
  BookOpen,
  Camera,
  Clock,
  Code2,
  Eye,
  Hourglass,
  Keyboard,
  ListChecks,
  MousePointer,
  MousePointerClick,
  Package,
  ScanSearch,
  Terminal,
  Wrench,
} from 'lucide-react';

import { translate, type TranslationKey } from '@/shared/i18n/translate';

type ToolIcon = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

export interface ToolPresentation {
  display: string;
  icon: ToolIcon;
}

interface ToolPreset {
  displayKey: TranslationKey;
  icon: ToolIcon;
}

// Keys are the full tool names the core exposes: `{brick identifier}__{tool}`,
// joined with the default BRICK_TOOL_NAME_SEPARATOR preference. A custom
// separator or an unknown tool falls through to the humanized name.
const PRESETS: Record<string, ToolPreset> = {
  ui__take_screenshot: { displayKey: 'tools.uiTakeScreenshot', icon: Camera },
  ui__press_keyboard_keys: { displayKey: 'tools.uiPressKeyboardKeys', icon: Keyboard },
  ui__type_unicode_text: { displayKey: 'tools.uiTypeUnicodeText', icon: Keyboard },
  ui__click_pointer: { displayKey: 'tools.uiClickPointer', icon: MousePointerClick },
  ui__move_pointer_coordinates: {
    displayKey: 'tools.uiMovePointerCoordinates',
    icon: MousePointer,
  },
  ui__move_pointer_description: { displayKey: 'tools.uiMovePointerDescription', icon: ScanSearch },
  vision__view_images: { displayKey: 'tools.visionViewImages', icon: Eye },
  system__run_terminal_command: { displayKey: 'tools.systemRunTerminalCommand', icon: Terminal },
  system__get_current_date_time: { displayKey: 'tools.systemGetCurrentDateTime', icon: Clock },
  code__run_python_code: { displayKey: 'tools.codeRunPythonCode', icon: Code2 },
  code__install_python_packages: { displayKey: 'tools.codeInstallPythonPackages', icon: Package },
  scheduler__schedule_notification: {
    displayKey: 'tools.schedulerScheduleNotification',
    icon: BellPlus,
  },
  scheduler__list_scheduled_notifications: {
    displayKey: 'tools.schedulerListScheduledNotifications',
    icon: ListChecks,
  },
  scheduler__delete_scheduled_notification: {
    displayKey: 'tools.schedulerDeleteScheduledNotification',
    icon: BellOff,
  },
  scheduler__wait: { displayKey: 'tools.schedulerWait', icon: Hourglass },
  skills__load_skill: { displayKey: 'tools.skillsLoadSkill', icon: BookOpen },
};

const FALLBACK_ICON = Wrench;

function computeDisplayFromToolName(toolName: string): string {
  return toolName
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (character): string => character.toUpperCase());
}

export function presentTool(toolName: string): ToolPresentation {
  const preset = PRESETS[toolName];
  if (preset !== undefined) {
    return { display: translate(preset.displayKey), icon: preset.icon };
  }
  return {
    display: computeDisplayFromToolName(toolName),
    icon: FALLBACK_ICON,
  };
}
