import { RumoUIComponent } from './component';

export interface RumoCommandItem {
  /** 指令唯一标识 */
  id: string | number;

  /** 指令标题 */
  title: string;

  /** 分类(可选,展示与匹配用) */
  category?: string;

  /** 快捷键提示文本(仅展示,如 'Ctrl+D') */
  shortcut?: string;

  /** 图标(文本/字符透传展示) */
  icon?: string;
}

/** CommandPalette Component */
export declare class RumoCommandPalette extends RumoUIComponent {
  /** 面板可见性(v-model / .sync) */
  visible: boolean;

  /** 指令列表 */
  commands: RumoCommandItem[];

  /** 搜索框占位文案(默认走 i18n) */
  placeholder: string;

  /** 全局组合键,逗号分隔多组(如 'ctrl+k, command+k');false 关闭全局监听 */
  hotkey: string | boolean;

  /** 响应范围:'global' 或容器选择器 / DOM 元素 */
  scope: string | HTMLElement;

  /** Dash 皮肤视觉变体;设置为 'dash' 时启用看板视觉 */
  variant: string;
}
