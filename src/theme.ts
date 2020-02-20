import { Theme, DefaultTheme, MyTheme } from 'react-native-paper'

let setThemeState: React.Dispatch<React.SetStateAction<Theme>> = null as any

export type ThemeColorType = 'green' | 'pink'

export const colors: { [ThemeColorName in ThemeColorType]: MyTheme['colors'] } = {
  green: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#0DBC79',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',

    dark: '#388E3C',
    light: '#4CAF50'
  },

  pink: {
    ...DefaultTheme.colors,
    primary: '#E91E63',
    accent: '#F44336',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',
    
    dark: '#C2185B',
    light: '#F8BBD0'
  }
}

export const initSetThemeStateMethod = (method: typeof setThemeState) => setThemeState = method

export function setThemeColor(themeColor: ThemeColorType) {
  setThemeState({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...colors[themeColor]
    }
  })  
}