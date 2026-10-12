import { agentsApi } from '@/features/agents/apis/agents-api';
import type { Agent } from '@/features/agents/types/agent';
import type { AgentInput } from '@/features/agents/types/agent-input';
import { AgentReasoning } from '@/features/agents/types/agent-reasoning';
import { AgentVerbosity } from '@/features/agents/types/agent-verbosity';
import { bricksApi } from '@/features/bricks/apis/bricks-api';
import type { Brick } from '@/features/bricks/types/brick';
import type { BrickConfig } from '@/features/bricks/types/brick-config';
import { BrickConfigType } from '@/features/bricks/types/brick-config-type';
import { BrickConfigUiMovePointerCoordinateSpace } from '@/features/bricks/types/brick-config-ui-move-pointer-coordinate-space';
import { BrickConfigUiMovePointerGeometry } from '@/features/bricks/types/brick-config-ui-move-pointer-geometry';
import type { BrickInput } from '@/features/bricks/types/brick-input';
import { llmModelsApi } from '@/features/llm-models/apis/llm-models-api';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';
import { translate } from '@/shared/i18n/translate';

interface RunOnboardingFinalizationArgs {
  providerId: string;
  providerConfigType: ProviderConfigType;
}

export interface OnboardingFinalizationResult {
  agent: Agent;
}

const PREFERRED_MODEL_ID_BY_PROVIDER_TYPE: Partial<Record<ProviderConfigType, string>> = {
  [ProviderConfigType.Anthropic]: 'claude-sonnet-5-5',
  [ProviderConfigType.Openai]: 'gpt-5.6-sol',
};

function pickPreferredModel(
  models: LlmModel[],
  providerConfigType: ProviderConfigType,
): LlmModel | null {
  const preferred = PREFERRED_MODEL_ID_BY_PROVIDER_TYPE[providerConfigType];
  if (preferred !== undefined) {
    const match = models.find((entry): boolean => entry.modelId === preferred);
    if (match !== undefined) {
      return match;
    }
  }
  return models[0] ?? null;
}

async function findOrCreateBrick(
  existing: Brick[],
  name: string,
  config: BrickConfig,
): Promise<Brick> {
  const match = existing.find((entry): boolean => entry.name === name);
  if (match !== undefined) {
    return match;
  }
  const input: BrickInput = { name, config };
  return bricksApi.save(input, null);
}

async function findOrCreateAgent(existing: Agent[], input: AgentInput): Promise<Agent> {
  const match = existing.find((entry): boolean => entry.name === input.name);
  if (match !== undefined) {
    return match;
  }
  return agentsApi.save(input, null);
}

export async function runOnboardingFinalization(
  args: RunOnboardingFinalizationArgs,
): Promise<OnboardingFinalizationResult> {
  const models = await llmModelsApi.getAll(args.providerId);
  const model = pickPreferredModel(models, args.providerConfigType);
  if (model === null) {
    throw new Error(translate('onboarding.finalizingFailed'));
  }

  // Sequential on purpose: every brick save triggers a full refresh in the
  // core, and concurrent refreshes race each other.
  const existingBricks = await bricksApi.getAll(null);
  const uiBrick = await findOrCreateBrick(
    existingBricks,
    translate('onboarding.defaultBrickUiName'),
    {
      type: BrickConfigType.Ui,
      movePointerLlmModelId: model.id,
      movePointerGeometry: BrickConfigUiMovePointerGeometry.Point,
      movePointerCoordinateSpace: BrickConfigUiMovePointerCoordinateSpace.Pixels,
    },
  );
  const visionBrick = await findOrCreateBrick(
    existingBricks,
    translate('onboarding.defaultBrickVisionName'),
    { type: BrickConfigType.Vision },
  );
  const systemBrick = await findOrCreateBrick(
    existingBricks,
    translate('onboarding.defaultBrickSystemName'),
    { type: BrickConfigType.System },
  );
  const schedulerBrick = await findOrCreateBrick(
    existingBricks,
    translate('onboarding.defaultBrickSchedulerName'),
    { type: BrickConfigType.Scheduler },
  );
  const codeBrick = await findOrCreateBrick(
    existingBricks,
    translate('onboarding.defaultBrickCodeName'),
    { type: BrickConfigType.Code },
  );
  const skillsBrick = await findOrCreateBrick(
    existingBricks,
    translate('onboarding.defaultBrickSkillsName'),
    { type: BrickConfigType.Skills },
  );

  const existingAgents = await agentsApi.getAll();
  const agent = await findOrCreateAgent(existingAgents, {
    name: translate('onboarding.defaultAgentName'),
    pictureFileKey: null,
    prompt: null,
    reasoning: AgentReasoning.Default,
    verbosity: AgentVerbosity.Default,
    llmModelId: model.id,
    brickIds: [
      uiBrick.id,
      visionBrick.id,
      systemBrick.id,
      schedulerBrick.id,
      codeBrick.id,
      skillsBrick.id,
    ],
    attachedFilePaths: [],
  });

  return { agent };
}
