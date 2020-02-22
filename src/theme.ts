import { Theme, DefaultTheme, MyTheme } from 'react-native-paper'

let setThemeState: React.Dispatch<React.SetStateAction<Theme>> = null as any

export const themeColorType = {
  green: '萌百绿',
  pink: 'H萌粉',
  blue: '天蓝',
  indigo: '夜空蓝',
  deepPurple: '深紫',
  teal: '水绿'
}

export type ThemeColorType = keyof typeof themeColorType

export const colors: { [ThemeColorName in ThemeColorType]: MyTheme['colors'] } = {
  green: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#0DBC79',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',

    dark: '#388E3C',
    light: '#B5E9B5'
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
  },

  blue: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    accent: '#448AFF',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',

    dark: '#1976D2',
    light: '#BBDEFB'
  },

  indigo: {
    ...DefaultTheme.colors,
    primary: '#3F51B5',
    accent: '#448AFF',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',

    dark: '#303F9F',
    light: '#C5CAE9'
  },

  deepPurple: {
    ...DefaultTheme.colors,
    primary: '#673AB7',
    accent: '#7B1FA2',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',

    dark: '#512DA8',
    light: '#D1C4E9'
  },

  teal: {
    ...DefaultTheme.colors,
    primary: '#009688',
    accent: '#03A9F4',
    text: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',

    dark: '#00796B',
    light: '#B2DFDB'
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