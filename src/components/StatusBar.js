import React from 'react'
import PropTypes from 'prop-types'
import { StatusBar, View, NativeModules } from 'react-native'


MyStatusBar.propTypes = {
  color: PropTypes.string
}

export default function MyStatusBar({
  hidden = false,
  color = $colors.dark,
  blackText = false
}){
  return (
    <View>
      <StatusBar
        animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
        hidden={hidden}  //是否隐藏状态栏。
        backgroundColor={color} //状态栏的背景色
        translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
        barStyle={`${blackText ? 'dark' : 'light'}-content`}
      />

      {/* 添加一个和状态栏同样高度的占位容器 */}
      <View style={{ height: hidden ? 0 : NativeModules.StatusBarManager.HEIGHT }} />
    </View>
  )
}