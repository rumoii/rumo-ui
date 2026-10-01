import { RumoUIComponent } from './component';

export type LogViewerTheme = 'dark' | 'light';

/** LogViewer Component */
export declare class RumoLogViewer extends RumoUIComponent {
  /** Log data source, string or array of strings */
  data: string | string[];

  /** Viewport height, e.g. '400px' or 400 */
  height: string | number;

  /** Auto scroll to bottom when new logs arrive */
  follow: boolean;

  /** Whether to parse ANSI color escape codes */
  ansi: boolean;

  /** Whether to wrap long lines */
  wrap: boolean;

  /** Filter logs by case-insensitive keyword */
  filter: string;

  /** Theme mode, dark or light */
  theme: LogViewerTheme;

  /** Whether to show line numbers */
  showLineNumber: boolean;

  /** Header title text */
  title: string;

  /** Loading state */
  loading: boolean;

  /** Text displayed when empty */
  emptyText: string;

  /** Scroll to the bottom of the log viewer */
  scrollToBottom(): void;

  /** Scroll to the top of the log viewer */
  scrollToTop(): void;

  /** Get visible/filtered raw text joined by newline */
  getRawText(): string;
}
