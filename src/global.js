import { StyleSheet } from 'react-native'

const colors = {
  main: '#3CAD3D',
  dark: '#318D32',
  light: '#87CD88',
  sub: '#0DBC79'
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
global.$avatarUrl = 'https://commons.moegirl.org/extensions/Avatar/avatar.php?user='