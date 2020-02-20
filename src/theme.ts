import { Theme, DefaultTheme } from 'react-native-paper'

let setThemeState: React.Dispatch<React.SetStateAction<Theme>> = null as any

export type ThemeColorType = 'green' | 'pink'

export const colors: { [ThemeColorName in ThemeColorType]: Theme['colors'] } = {
  green: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#0DBC79',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',
    surface: '#96D881',
  },

  pink: {
    ...DefaultTheme.colors,
    primary: '#E91E63',
    accent: '#C7018F',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',
    surface: '#F8BBD0',
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