export const BrickConfigType = {
  Ui: 'UI',
  Code: 'CODE',
  System: 'SYSTEM',
  Scheduler: 'SCHEDULER',
  Renderer: 'RENDERER',
  Browser: 'BROWSER',
  Agent: 'AGENT',
  Custom: 'CUSTOM',
  Vision: 'VISION',
  Skills: 'SKILLS',
} as const;
export type BrickConfigType = (typeof BrickConfigType)[keyof typeof BrickConfigType];
