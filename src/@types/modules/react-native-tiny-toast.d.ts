declare module 'react-native-tiny-toast' {
  import { StyleProp, ViewStyle } from 'react-native'
  
  export interface ShowOptions {
    position: number
    containerStyle: StyleProp<ViewStyle>
  } 
  
  interface TinyToast {
    show (message: string, options?: ShowOptions): void
    showLoading (message?: string, options?: ShowOptions): void
    showSuccess (message: string, options?: ShowOptions): void
    hide (): void
  }

  const tinyToast: TinyToast
  export default tinyToast
}