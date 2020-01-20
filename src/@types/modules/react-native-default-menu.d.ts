declare module 'react-native-default-menu' {
  import { FC, MutableRefObject } from 'react'
  import { StyleProp, ViewStyle } from 'react-native'

  export interface DefaultMenuRef {
    showPopupMenu (): void
  }

  export interface DefaultMenuProps {
    options: string[]
    style?: StyleProp<ViewStyle>
    onPress? (eventName: string, index: number): void
    ref?: MutableRefObject<DefaultMenuRef | undefined>
  }

  const DefaultMenu: FC<DefaultMenuProps>
  export default DefaultMenu
}