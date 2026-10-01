/**
 * 零依赖模糊匹配 —— 子序列评分(词边界/连续命中加分)
 * 供 CommandSelect 与 --list 过滤共用。
 */

export interface FuzzyMatch {
  score: number;
  /** 命中下标(用于高亮;未命中为 null) */
  indices: number[] | null;
}

/**
 * 对 query 在 text 中做子序列匹配。
 * 返回 null 表示不命中;命中返回分数(越大越靠前)与命中下标。
 */
export function fuzzyMatch(query: string, text: string): FuzzyMatch | null {
  if (!query) return { score: 0, indices: [] };
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const indices: number[] = [];
  let score = 0;
  let ti = 0;
  let consecutive = 0;

  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    if (ch === ' ') continue;
    const found = t.indexOf(ch, ti);
    if (found === -1) return null;
    indices.push(found);
    // 词边界加分:首字符或前一字符为非字母数字
    const prev = found > 0 ? t[found - 1] : '';
    if (found === 0 || !/[a-z0-9]/.test(prev)) score += 6;
    // 连续命中加分
    if (found === ti && qi > 0) {
      consecutive += 1;
      score += 3 + consecutive;
    } else {
      consecutive = 0;
    }
    // 距离惩罚(跳跃越远越低分)
    if (qi > 0) score -= Math.min(found - ti, 5) * 0.5;
    ti = found + 1;
  }
  // 短文本轻微优先,长文本不至于沉底
  score += Math.max(0, 10 - (t.length - q.length) * 0.1);
  return { score, indices };
}

/** 按分数降序过滤排序;空 query 原序返回全部 */
export function fuzzyFilter<T>(query: string, items: T[], getText: (item: T) => string): T[] {
  if (!query.trim()) return items.slice();
  const scored: Array<{ item: T; score: number }> = [];
  for (const item of items) {
    const m = fuzzyMatch(query, getText(item));
    if (m) scored.push({ item, score: m.score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}
