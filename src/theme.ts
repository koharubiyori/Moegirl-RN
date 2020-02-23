import { Theme, DefaultTheme, MyTheme } from 'react-native-paper'

let setThemeState: React.Dispatch<React.SetStateAction<Theme>> = null as any

export const themeColorType = {
  green: '萌百绿',
  pink: 'H萌粉',
  blue: '天蓝',
  indigo: '夜空蓝',
  deepPurple: '深紫',
  teal: '水绿',
  night: '黑夜'
}

export type ThemeColorType = keyof typeof themeColorType

const commonColors = {
  text: '#212121',
  disabled: '#757575',
  placeholder: '#BDBDBD',
  background: 'white',
  onSurface: 'white',

  lightBg: '#eee'
}

export const colors: { [ThemeColorName in ThemeColorType]: MyTheme['colors'] } = {
  night: {
    ...DefaultTheme.colors,
    primary: '#4E4E4E',
    accent: '#0DBC79',
    text: '#BFBFBF',
    disabled: '#D0D0D0',
    placeholder: '#797979',
    background: '#3A3A3B',
    surface: '#4E4E4E',
    
    dark: '#076642',
    light: '#0B9560',
    onSurface: '#BFBFBF',
    lightBg: '#797979'
  },
  
  green: {
    ...DefaultTheme.colors,
    ...commonColors,
    primary: '#4CAF50',
    accent: '#4CAF50',

    dark: '#388E3C',
    light: '#B5E9B5',
  },

  pink: {
    ...DefaultTheme.colors,
    ...commonColors,
    primary: '#E91E63',
    accent: '#E91E63',
    
    dark: '#C2185B',
    light: '#F8BBD0'
  },

  blue: {
    ...DefaultTheme.colors,
    ...commonColors,
    primary: '#1976D2',
    accent: '#1976D2',

    dark: '#1976D2',
    light: '#BBDEFB'
  },

  indigo: {
    ...DefaultTheme.colors,
    ...commonColors,
    primary: '#3F51B5',
    accent: '#3F51B5',

    dark: '#303F9F',
    light: '#C5CAE9'
  },

  deepPurple: {
    ...DefaultTheme.colors,
    ...commonColors,
    primary: '#673AB7',
    accent: '#673AB7',

    dark: '#512DA8',
    light: '#D1C4E9'
  },

  teal: {
    ...DefaultTheme.colors,
    ...commonColors,
    primary: '#009688',
    accent: '#009688',

    dark: '#00796B',
    light: '#B2DFDB'
  }
}

export const initSetThemeStateMethod = (method: typeof setThemeState) => setThemeState = method

export function setThemeColor(themeColor: ThemeColorType, dark?: boolean) {
  setThemeState({
    ...DefaultTheme,
    ...(dark ? { dark } : {}),
    colors: {
      ...DefaultTheme.colors,
      ...colors[themeColor]
    }
  })  
}