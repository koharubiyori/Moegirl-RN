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

// 使用props.navigation.addEventListener('willBlur', handler) 监听页面离开，在要离开时设置这个值
global.$lastTransition = ''     // 用于在使用非全局页面过渡动画时，在离开那个页面时也能正确使用那个页面的离开动画，而不是离开后要前往的页面的动画
                                