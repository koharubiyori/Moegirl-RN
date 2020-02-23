import { colors as _colors } from '~/theme'

export = Theme
export as namespace __Theme

declare namespace Theme {
  type Colors = typeof _colors
  type ThemeColors = Colors['blue']
}