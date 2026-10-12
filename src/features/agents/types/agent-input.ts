import type { AgentReasoning } from '@/features/agents/types/agent-reasoning';
import type { AgentVerbosity } from '@/features/agents/types/agent-verbosity';

export interface AgentInput {
  name: string;
  pictureFileKey: string | null;
  prompt: string | null;
  reasoning: AgentReasoning;
  verbosity: AgentVerbosity;
  llmModelId: string;
  brickIds: string[];
  attachedFilePaths: string[];
}
