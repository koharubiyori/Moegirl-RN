import { StyleSheet } from 'react-native'

const colors = {
  main: '#3CAD3D',
  dark: '#318D32',
  light: '#87CD88',
}

const theme = StyleSheet.create({
  mainBg: {
    backgroundColor: colors.main,
  },

  white: {
    color: 'white'
  }
})

global.$colors = colors
global.$theme = theme