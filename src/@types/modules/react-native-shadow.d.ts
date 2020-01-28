declare module 'react-native-shadow' {
  import { FC } from 'react'
  import { StyleProp, ViewStyle } from 'react-native'
  
  export interface BorderShadowSettings {
    width: number
    color: string
    border: number
    opacity: number
    style: StyleProp<ViewStyle>
    side: 'top' | 'bottom'
    insert: boolean
  }

  export const BorderShadow: FC<{ setting: Partial<BorderShadowSettings> }>
}