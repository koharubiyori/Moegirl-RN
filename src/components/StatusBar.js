import React from 'react'
import PropTypes from 'prop-types'
import { StatusBar } from 'react-native'

MyStatusBar.propTypes = {
  animated: PropTypes.bool,
  hidden: PropTypes.bool,
  translucent: PropTypes.bool,
  color: PropTypes.string,
  blackText: PropTypes.bool
}

export default function MyStatusBar({
  animated = true,
  hidden = false,
  translucent = false,
  color = $colors.dark,
  blackText = false
}){
  return (
    <StatusBar
      animated={animated} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
      hidden={hidden}  //是否隐藏状态栏。
      backgroundColor={color} //状态栏的背景色
      translucent={translucent}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
      barStyle={`${blackText ? 'dark' : 'light'}-content`}
    />
  )
}