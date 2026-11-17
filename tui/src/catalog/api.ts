import fs from 'node:fs';
import path from 'node:path';
import { repoRoot } from '../lib/repo-locate.js';

interface ApiMember {
  name: string;
  type?: string[] | null;
  required?: boolean;
  default?: unknown;
  defaultExpression?: string;
  docs: Array<{ description: string }>;
}

export interface ApiEntry {
  id: string;
  exportName: string | null;
  tag: string | null;
  kind: string;
  props: ApiMember[];
  events: ApiMember[];
  slots: ApiMember[];
  methods: ApiMember[];
}

/** 清单由根目录生成;读取不依赖组件运行代码或解析器。 */
export function loadApi(root: string = repoRoot()): ApiEntry[] {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'components.api.json'), 'utf8'));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.components)) {
    throw new Error('components.api.json 格式不支持,请执行 npm run build:api');
  }
  for (const entry of manifest.components) {
    if (typeof entry.id !== 'string' || !['props', 'events', 'slots', 'methods'].every((group) =>
      Array.isArray(entry[group]) && entry[group].every((item: ApiMember) => typeof item.name === 'string' && Array.isArray(item.docs)))) {
      throw new Error('components.api.json 条目无效,请执行 npm run build:api');
    }
  }
  return manifest.components as ApiEntry[];
}

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');

export function findApi(name: string, entries: ApiEntry[]): ApiEntry | undefined {
  return entries.find((entry) => [entry.id, entry.exportName, entry.tag].some((value) => value && normalize(value) === normalize(name)));
}

export function formatApi(entry: ApiEntry): string {
  const cell = (value: string): string => value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  const out = [`${entry.exportName ?? entry.id} (${entry.kind}) ${entry.tag ?? ''}`.trim()];
  for (const [group, title] of [['props', 'Props'], ['events', 'Events'], ['slots', 'Slots'], ['methods', 'Methods']] as const) {
    out.push('', title, '| Name | Type | Required | Default | Description |', '| --- | --- | --- | --- | --- |');
    for (const item of entry[group]) {
      const defaultValue = Object.hasOwn(item, 'default') ? JSON.stringify(item.default) : item.defaultExpression ?? '—';
      out.push(`| ${cell(item.name)} | ${cell(item.type?.join(' / ') ?? '—')} | ${item.required === undefined ? '—' : String(item.required)} | ${cell(defaultValue)} | ${cell(item.docs.map((row) => row.description).join('; '))} |`);
    }
    if (entry[group].length === 0) out.push('| — | — | — | — | — |');
  }
  return out.join('\n') + '\n';
}
