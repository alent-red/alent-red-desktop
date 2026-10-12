import * as React from 'react';

import { Bot, Plus, Search } from 'lucide-react';

import type { Agent } from '@/features/agents/types/agent';
import { AgentAvatar } from '@/features/agents/views/agent-avatar';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import type { Provider } from '@/features/providers/types/provider';
import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Button } from '@/shared/views/button';
import { Input } from '@/shared/views/input';

interface AgentPickerProps {
  agents: Agent[];
  models: LlmModel[];
  providers: Provider[];
  value: string | null;
  onChange: (agentId: string) => void;
  onCreateAgent: () => void;
  className?: string;
  disabled?: boolean;
}

export const AgentPicker = ({
  agents,
  models,
  providers,
  value,
  onChange,
  onCreateAgent,
  className,
  disabled,
}: AgentPickerProps): React.ReactElement => {
  const [query, setQuery] = React.useState('');

  const modelsById = React.useMemo(
    (): Map<string, LlmModel> =>
      new Map(models.map((model): [string, LlmModel] => [model.id, model])),
    [models],
  );
  const providersById = React.useMemo(
    (): Map<string, Provider> =>
      new Map(providers.map((provider): [string, Provider] => [provider.id, provider])),
    [providers],
  );

  const filteredAgents = React.useMemo((): Agent[] => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) {
      return agents;
    }
    return agents.filter((agent): boolean => agent.name.toLowerCase().includes(trimmed));
  }, [agents, query]);

  if (agents.length === 0) {
    return (
      <div
        className={mergeClasses(
          'rounded-[10px] border border-default bg-input p-6',
          'flex flex-col items-center justify-center gap-2 text-center',
          className,
        )}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-active)] text-[var(--text-muted)]">
          <Bot size={18} strokeWidth={2} aria-hidden />
        </span>
        <div className="text-[13px] font-medium text-primary">
          {translate('agents.noAgentsTitle')}
        </div>
        <div className="text-[11.5px] text-muted max-w-[260px] leading-relaxed">
          {translate('agents.noAgentsBody')}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateAgent}
          className="mt-1"
          disabled={disabled}
        >
          <Plus size={13} strokeWidth={2.2} />
          {translate('agents.createAgent')}
        </Button>
      </div>
    );
  }

  return (
    <div className={mergeClasses('flex flex-col gap-2', className)}>
      <div className="relative">
        <Search
          size={13}
          strokeWidth={2.1}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <Input
          value={query}
          onChange={(event): void => {
            setQuery(event.target.value);
          }}
          placeholder={translate('agents.searchAgents')}
          className="pl-8 h-8 text-[12.5px]"
          disabled={disabled}
        />
      </div>
      {filteredAgents.length === 0 ? (
        <div className="px-3 py-6 text-center text-[12.5px] text-muted">
          {translate('agents.noAgentsMatching', { query: query.trim() })}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredAgents.map((agent): React.ReactElement => {
            const isSelected = agent.id === value;
            const model =
              agent.llmModelId !== null && agent.llmModelId !== ''
                ? (modelsById.get(agent.llmModelId) ?? null)
                : null;
            const provider = model !== null ? (providersById.get(model.providerId) ?? null) : null;
            return (
              <li key={agent.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={disabled}
                  onClick={(): void => {
                    onChange(agent.id);
                  }}
                  className={mergeClasses(
                    'w-full flex items-center gap-2.5 rounded-[10px] border bg-surface px-3 py-2 text-left',
                    'transition-[border-color,background-color,box-shadow] duration-[140ms]',
                    'hover:bg-[var(--bg-hover)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface',
                    isSelected
                      ? 'border-[var(--color-brand)] bg-[var(--bg-selected)] shadow-[0_0_0_1px_var(--color-brand)]'
                      : 'border-[var(--border-default)]',
                  )}
                >
                  <AgentAvatar name={agent.name} pictureFileKey={agent.pictureFileKey} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-primary truncate">
                      {agent.name}
                    </div>
                    <div className="text-[11.5px] text-muted truncate">
                      {provider !== null && model !== null
                        ? `${provider.name} · ${model.name}`
                        : translate('agents.noModelAssigned')}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
