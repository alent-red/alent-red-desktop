import type { Link, Node, Parent, PhrasingContent, Root, Text } from 'mdast';

import { isLocalPath } from '@/shared/lib/is-local-path';
import { localPathHref } from '@/shared/lib/local-path-href';
import { splitLocalPaths } from '@/shared/lib/split-local-paths';

const SKIPPED_PARENT_TYPES = new Set(['link', 'linkReference', 'definition']);
const WEB_URL_PATTERN = /^https?:\/\/\S+$/;

function buildPathLink(path: string): Link {
  return {
    type: 'link',
    url: localPathHref.encode(path),
    children: [{ type: 'text', value: path }],
  };
}

function buildWebLink(url: string): Link {
  return { type: 'link', url, children: [{ type: 'text', value: url }] };
}

function isParent(node: Node): node is Parent {
  return 'children' in node && Array.isArray((node as Parent).children);
}

function transformTextNode(node: Text): PhrasingContent[] {
  const segments = splitLocalPaths(node.value);
  if (!segments.some((segment): boolean => segment.isPath)) {
    return [node];
  }
  return segments.map(
    (segment): PhrasingContent =>
      segment.isPath ? buildPathLink(segment.value) : { type: 'text', value: segment.value },
  );
}

function visit(parent: Parent): void {
  if (SKIPPED_PARENT_TYPES.has(parent.type)) {
    return;
  }
  const next: Node[] = [];
  for (const child of parent.children) {
    if (child.type === 'text') {
      next.push(...transformTextNode(child));
      continue;
    }
    if (child.type === 'inlineCode' && isLocalPath(child.value)) {
      next.push(buildPathLink(child.value));
      continue;
    }
    if (child.type === 'inlineCode' && WEB_URL_PATTERN.test(child.value)) {
      next.push(buildWebLink(child.value));
      continue;
    }
    if (isParent(child)) {
      visit(child);
    }
    next.push(child);
  }
  parent.children = next as Parent['children'];
}

// Remark plugin turning absolute local paths written in prose or inline code
// into links under the private local-path scheme, and inline code holding a
// bare web URL into a regular link.
export function remarkLocalPaths(): (tree: Root) => void {
  return (tree: Root): void => {
    visit(tree);
  };
}
