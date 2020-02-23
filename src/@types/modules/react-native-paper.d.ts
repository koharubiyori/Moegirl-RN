declare module 'react-native-paper' {
  export * from '~/../node_modules/react-native-paper'
  import { Theme } from 'react-native-paper'

  export interface MyTheme extends Theme {
    colors: Theme['colors'] & {
      [CustomColor in 
        'dark' | 'light' | 'lightBg'
      ]: string
    }
  }

  export const useTheme: (overrides?: any) => MyTheme
}