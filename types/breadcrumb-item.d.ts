import { RumoUIComponent } from './component'

/** Breadcrumb Item Component */
export declare class RumoBreadcrumbItem extends RumoUIComponent {
  /** Target route of the link, same as to of vue-router */
  to: string | object

  /** If true, the navigation will not leave a history record */
  replace: boolean
}
