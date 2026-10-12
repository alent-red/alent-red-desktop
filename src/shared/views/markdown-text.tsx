import * as React from 'react';

import { openUrl } from '@tauri-apps/plugin-opener';
import ReactMarkdown, { type Components, defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';

import { localPathHref } from '@/shared/lib/local-path-href';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { remarkLocalPaths } from '@/shared/lib/remark-local-paths';
import { LocalPathLink } from '@/shared/views/local-path-link';

interface MarkdownTextProps {
  children: string;
  className?: string;
  onOpenPath?: (path: string) => void;
}

const handleLinkClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string | undefined,
): void => {
  event.preventDefault();
  if (href === undefined || href.length === 0) {
    return;
  }
  openUrl(href).catch((caught: unknown): void => {
    console.error('Failed to open link', caught);
  });
};

// react-markdown strips unknown protocols for safety; the private local-path
// scheme is ours and must survive the sanitizer.
function transformUrl(url: string): string {
  return localPathHref.decode(url) === null ? defaultUrlTransform(url) : url;
}

const COMPONENTS: Components = {
  p: ({ children }): React.ReactElement => (
    <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>
  ),
  strong: ({ children }): React.ReactElement => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }): React.ReactElement => <em className="italic">{children}</em>,
  ul: ({ children }): React.ReactElement => (
    <ul className="my-1.5 ml-5 list-disc space-y-0.5">{children}</ul>
  ),
  ol: ({ children }): React.ReactElement => (
    <ol className="my-1.5 ml-5 list-decimal space-y-0.5">{children}</ol>
  ),
  li: ({ children }): React.ReactElement => <li className="leading-[1.5]">{children}</li>,
  blockquote: ({ children }): React.ReactElement => (
    <blockquote className="my-2 border-l-2 border-[var(--border-default)] pl-3 text-[var(--text-muted)]">
      {children}
    </blockquote>
  ),
  code: ({ children, className }): React.ReactElement => {
    const isBlock = className?.startsWith('language-') === true;
    if (isBlock) {
      return <code className="font-mono text-[12.5px]">{children}</code>;
    }
    return (
      <code className="rounded-[4px] bg-[var(--bg-surface-raised)] px-1 py-0.5 font-mono text-[12.5px]">
        {children}
      </code>
    );
  },
  pre: ({ children }): React.ReactElement => (
    <pre className="my-2 overflow-x-auto rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-3 leading-[1.5]">
      {children}
    </pre>
  ),
  h1: ({ children }): React.ReactElement => (
    <h1 className="mb-1.5 mt-3 text-[15px] font-semibold first:mt-0">{children}</h1>
  ),
  h2: ({ children }): React.ReactElement => (
    <h2 className="mb-1.5 mt-3 text-[14.5px] font-semibold first:mt-0">{children}</h2>
  ),
  h3: ({ children }): React.ReactElement => (
    <h3 className="mb-1 mt-2.5 text-[14px] font-semibold first:mt-0">{children}</h3>
  ),
  hr: (): React.ReactElement => <hr className="my-3 border-t border-[var(--border-default)]" />,
  table: ({ children }): React.ReactElement => (
    <div className="my-2 overflow-x-auto">
      <table className="border-collapse text-[12.5px]">{children}</table>
    </div>
  ),
  th: ({ children }): React.ReactElement => (
    <th className="border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-2 py-1 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }): React.ReactElement => (
    <td className="border border-[var(--border-default)] px-2 py-1">{children}</td>
  ),
};

export const MarkdownText = ({
  children,
  className,
  onOpenPath,
}: MarkdownTextProps): React.ReactElement => {
  const components = React.useMemo(
    (): Components => ({
      ...COMPONENTS,
      a: ({ children: linkChildren, href }): React.ReactElement => {
        const localPath = href === undefined ? null : localPathHref.decode(href);
        if (localPath !== null && onOpenPath !== undefined) {
          return <LocalPathLink path={localPath} onOpen={onOpenPath} />;
        }
        return (
          <a
            href={href}
            onClick={(event): void => {
              handleLinkClick(event, href);
            }}
            className="text-[var(--color-brand)] underline underline-offset-2 hover:opacity-80"
          >
            {linkChildren}
          </a>
        );
      },
    }),
    [onOpenPath],
  );
  const remarkPlugins = React.useMemo(
    (): PluggableList => (onOpenPath === undefined ? [remarkGfm] : [remarkGfm, remarkLocalPaths]),
    [onOpenPath],
  );
  return (
    <div className={mergeClasses(className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={components}
        urlTransform={transformUrl}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
