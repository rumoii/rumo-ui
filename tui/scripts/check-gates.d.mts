/** check-gates.mjs 的类型声明(供测试 import) */
export interface GateCheckContext {
  buildFiles?: Record<string, string>;
  srcFiles?: Record<string, string>;
  packageFilesField?: string[];
  componentsKeys?: string[];
  baselineKeys?: string[];
}

export interface GateResult {
  ok: boolean;
  detail: string;
}

export interface Gate {
  id: string;
  name: string;
  check(ctx: GateCheckContext): GateResult;
}

export declare const GATES: Gate[];
