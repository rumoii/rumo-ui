import Vue, { PluginObject } from 'vue'
import { RumoUIComponent, RumoUIComponentSize, RumoUIHorizontalAlignment } from './component'

import { RumoAffix } from './affix'
import { RumoAlert } from './alert'
import { RumoAside } from './aside'
import { RumoAutocomplete } from './autocomplete'
import { RumoBadge } from './badge'
import { RumoBreadcrumb } from './breadcrumb'
import { RumoBreadcrumbItem } from './breadcrumb-item'
import { RumoButton } from './button'
import { RumoButtonGroup } from './button-group'
import { RumoCard } from './card'
import { RumoCarousel } from './carousel'
import { RumoCarouselItem } from './carousel-item'
import { RumoCascader } from './cascader'
import { RumoCascaderPanel } from './cascader-panel'
import { RumoCheckbox } from './checkbox'
import { RumoCheckboxButton } from './checkbox-button'
import { RumoCheckboxGroup } from './checkbox-group'
import { RumoRectCheckbox } from './rect-checkbox'
import { RumoCol } from './col'
import { RumoCollapse } from './collapse'
import { RumoCollapseItem } from './collapse-item'
import { RumoColorPicker } from './color-picker'
import { RumoContainer } from './container'
import { RumoDatePicker } from './date-picker'
import { RumoDialog } from './dialog'
import { RumoDropdown } from './dropdown'
import { RumoDropdownItem } from './dropdown-item'
import { RumoDropdownMenu } from './dropdown-menu'
import { RumoFooter } from './footer'
import { RumoForm } from './form'
import { RumoFormItem } from './form-item'
import { RumoHeader } from './header'
import { RumoInput } from './input'
import { RumoInputNumber } from './input-number'
import { RumoLoading } from './loading'
import { RumoMain } from './main'
import { RumoMenu } from './menu'
import { RumoMenuItem } from './menu-item'
import { RumoMenuItemGroup } from './menu-item-group'
import { RumoMessage } from './message'
import { RumoMessageBox } from './message-box'
import { RumoNotification } from './notification'
import { RumoOption } from './option'
import { RumoOptionGroup } from './option-group'
import { RumoPagination } from './pagination'
import { RumoPopover } from './popover'
import { RumoProgress } from './progress'
import { RumoRate } from './rate'
import { RumoRadio } from './radio'
import { RumoRadioButton } from './radio-button'
import { RumoRadioGroup } from './radio-group'
import { RumoRow } from './row'
import { RumoSelect } from './select'
import { RumoSlider } from './slider'
import { RumoStep } from './step'
import { RumoSteps } from './steps'
import { RumoSubmenu } from './submenu'
import { RumoSwitch } from './switch'
import { RumoTable } from './table'
import { RumoTableColumn } from './table-column'
import { RumoTag } from './tag'
import { RumoTabs } from './tabs'
import { RumoTabPane } from './tab-pane'
import { RumoTimeline } from './timeline'
import { RumoTimelineItem } from './timeline-item'
import { RumoTimePicker } from './time-picker'
import { RumoTimeSelect } from './time-select'
import { RumoTooltip } from './tooltip'
import { RumoTransfer } from './transfer'
import { RumoTree, TreeData } from './tree'
import { RumoUpload } from './upload'
import { RumoLink } from './link'
import { RumoDivider } from './divider'
import { RumoIcon } from './icon'
import { RumoCalendar } from './calendar'
import { RumoImage } from './image'
import { RumoBacktop } from './backtop'
import { RumoInfiniteScroll } from './infiniteScroll'
import { RumoPageHeader } from './page-header'
import { RumoAvatar } from './avatar'

export interface InstallationOptions {
  locale: any,
  i18n: any,
  size: string
}

/** The version of Rumo UI */
export const version: string

/**
 * Install all Rumo UI components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(RumoUI)` to install.
 */
export function install (vue: typeof Vue, options: InstallationOptions): void

/** RumoUI component common definition */
export type Component = RumoUIComponent

/** Component size definition for button, input, etc */
export type ComponentSize = RumoUIComponentSize

/** Horizontal alignment */
export type HorizontalAlignment = RumoUIHorizontalAlignment

/** Show animation while loading data */
export const Loading: RumoLoading

/** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
export const Message: RumoMessage

/** A set of modal boxes simulating system message box, mainly for message prompt, success tips, error messages and query information */
export const MessageBox: RumoMessageBox

/** Displays a global notification message at the upper right corner of the page */
export const Notification: RumoNotification

// TS cannot merge imported class with namespace, so declare subclasses instead

/** Alert Component */
export class Alert extends RumoAlert {}

/** Aside Component */
export class Aside extends RumoAside {}

/** Autocomplete Component */
export class Autocomplete extends RumoAutocomplete {}

/** Bagde Component */
export class Badge extends RumoBadge {}

/** Breadcrumb Component */
export class Breadcrumb extends RumoBreadcrumb {}

/** Breadcrumb Item Component */
export class BreadcrumbItem extends RumoBreadcrumbItem {}

/** Button Component */
export class Button extends RumoButton {}

/** Button Group Component */
export class ButtonGroup extends RumoButtonGroup {}

/** Card Component */
export class Card extends RumoCard {}

/** Cascader Component */
export class Cascader extends RumoCascader {}

export class CascaderPanel extends RumoCascaderPanel {}

/** Carousel Component */
export class Carousel extends RumoCarousel {}

/** Carousel Item Component */
export class CarouselItem extends RumoCarouselItem {}

/** Checkbox Component */
export class Checkbox extends RumoCheckbox {}

/** Checkbox Button Component */
export class CheckboxButton extends RumoCheckboxButton {}

/** Checkbox Group Component */
export class CheckboxGroup extends RumoCheckboxGroup {}

/** Rect Checkbox Component */
export class RumoRectCheckbox extends RumoRectCheckbox {}

/** Colunm Layout Component */
export class Col extends RumoCol {}

/** Collapse Component */
export class Collapse extends RumoCollapse {}

/** Collapse Item Component */
export class CollapseItem extends RumoCollapseItem {}

/** Color Picker Component */
export class ColorPicker extends RumoColorPicker {}

/** Container Component */
export class Container extends RumoContainer {}

/** Date Picker Component */
export class DatePicker extends RumoDatePicker {}

/** Dialog Component */
export class Dialog extends RumoDialog {}

/** Dropdown Component */
export class Dropdown extends RumoDropdown {}

/** Dropdown Item Component */
export class DropdownItem extends RumoDropdownItem {}

/** Dropdown Menu Component */
export class DropdownMenu extends RumoDropdownMenu {}

/** Footer Component */
export class Footer extends RumoFooter {}

/** Form Component */
export class Form extends RumoForm {}

/** Form Item Component */
export class FormItem extends RumoFormItem {}

/** Header Component */
export class Header extends RumoHeader {}

/** Input Component */
export class Input extends RumoInput {}

/** Input Number Component */
export class InputNumber extends RumoInputNumber {}

/** Main Component */
export class Main extends RumoMain {}

/** Menu that provides navigation for your website */
export class Menu extends RumoMenu {}

/** Menu Item Component */
export class MenuItem extends RumoMenuItem {}

/** Menu Item Group Component */
export class MenuItemGroup extends RumoMenuItemGroup {}

/** Dropdown Select Option Component */
export class Option extends RumoOption {}

/** Dropdown Select Option Group Component */
export class OptionGroup extends RumoOptionGroup {}

/** Pagination Component */
export class Pagination extends RumoPagination {}

/** Popover Component */
export class Popover extends RumoPopover {}

/** Progress Component */
export class Progress extends RumoProgress {}

/** Rate Component */
export class Rate extends RumoRate {}

/** Radio Component */
export class Radio extends RumoRadio {}

/** Radio Button Component */
export class RadioButton extends RumoRadioButton {}

/** Radio Group Component */
export class RadioGroup extends RumoRadioGroup {}

/** Row Layout Component */
export class Row extends RumoRow {}

/** Dropdown Select Component */
export class Select extends RumoSelect {}

/** Slider Component */
export class Slider extends RumoSlider {}

/** Step Component */
export class Step extends RumoStep {}

/** Steps Component */
export class Steps extends RumoSteps {}

/** Submenu Component */
export class Submenu extends RumoSubmenu {}

/** Switch Component */
export class Switch extends RumoSwitch {}

/** Table Component */
export class Table extends RumoTable {}

/** Table Column Component */
export class TableColumn extends RumoTableColumn {}

/** Tabs Component */
export class Tabs extends RumoTabs {}

/** Tab Pane Component */
export class TabPane extends RumoTabPane {}

/** Tag Component */
export class Tag extends RumoTag {}

/** Timeline Component */
export class Timeline extends RumoTimeline {}

/** Timeline Item Component */
export class TimelineItem extends RumoTimelineItem {}

/** TimePicker Component */
export class TimePicker extends RumoTimePicker {}

/** TimeSelect Component */
export class TimeSelect extends RumoTimeSelect {}

/** Tooltip Component */
export class Tooltip extends RumoTooltip {}

/** Transfer Component */
export class Transfer extends RumoTransfer {}

/** Tree Component */
export class Tree<K = any, D = TreeData> extends RumoTree<K, D> {}

/** Upload Component */
export class Upload extends RumoUpload {}

/** Divider Component */
export class Divider extends RumoDivider {}

/** Link Component */
export class Link extends RumoLink {}

/** Image Component */
export class Image extends RumoImage {}

/** Icon Component */
export class Icon extends RumoIcon {}

/** Calendar Component */
export class Calendar extends RumoCalendar {}

/** Backtop Component */
export class Backtop extends RumoBacktop {}

/** InfiniteScroll Directive */
export const InfiniteScroll: PluginObject<RumoInfiniteScroll>;

/** PageHeader Component */
export class PageHeader extends RumoPageHeader {}

/** Avatar Component */
export class Avatar extends RumoAvatar {}
