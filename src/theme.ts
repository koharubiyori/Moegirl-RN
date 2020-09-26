import { Theme, DefaultTheme, MyTheme } from 'react-native-paper'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import { createRef } from 'react'

const themeName = (hans: string, hant: string) => ({ 'zh-hans': hans, 'zh-hant': hant })
export const themeColorType = {
  green: themeName('萌百绿', '萌百綠'),
  pink: themeName('H萌粉', 'H萌粉'),
  indigo: themeName('夜空蓝', '夜空藍'),
  orange: themeName('奇迹橙', '奇蹟橙'),
  blue: themeName('天蓝', '天藍'),
  deepPurple: themeName('深紫', '深紫'),
  teal: themeName('水绿', '水綠'),
  night: themeName('黑夜', '黑夜')
}

export type ThemeColorType = keyof typeof themeColorType

const commonColors = {
  text: '#323232',
  disabled: '#757575',
  placeholder: '#BDBDBD',
  background: 'white',
  onSurface: 'white',
  error: '#FF0000',

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
    error: '#FF0000',
    
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
  },

  orange: {
    ...DefaultTheme.colors,
    ...commonColors,
    primary: '#FFA000',
    accent: '#FFA000',

    dark: '#E38F00',
    light: '#FFD29A'
  }
}

export const initialTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    ...colors.green
  }
}

export const globalTheme = { current: initialTheme } // 向外部暴露一个全局主题对象，用来在settings切换主题时作为局部的provider使用，防止切换主题时从根树重渲染导致卡顿 
export type SetThemeState = React.Dispatch<React.SetStateAction<Theme>>
export type SetThemeColor = ReturnType<typeof createThemeColorSetter>

const globalSetTheme = { current: null as any as SetThemeColor }
export const initGlobalSetThemeMethod = (setThemeState: SetThemeState) => globalSetTheme.current = createThemeColorSetter(setThemeState)
export const setGlobalThemeColor = (themeColor: ThemeColorType) => globalSetTheme.current(themeColor)

export function createThemeColorSetter(setThemeState: SetThemeState) {
  return function setThemeColor(themeColor: ThemeColorType) {
    const willSetTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        ...colors[themeColor]
      }
    }
  
    setThemeState(willSetTheme)  
    globalTheme.current = willSetTheme
  
    setTimeout(() => {
      changeNavigationBarColor(themeColor === 'night' ? colors.night.background : 'white', themeColor !== 'night', true)
    })
  }
}