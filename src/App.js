import React from 'react'
import { ThemeContext, getTheme } from 'react-native-material-ui'
import AppNavigator from './router'

const theme = {
  palette: {
    primaryColor: $colors.main
  },
}

export default function App(){
  return (
    <ThemeContext.Provider value={getTheme(theme)}>
      <AppNavigator />
    </ThemeContext.Provider>
  )
}