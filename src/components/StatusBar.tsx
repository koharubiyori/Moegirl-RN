import React, { PropsWithChildren } from 'react'
import { NativeModules, StatusBar, View } from 'react-native'

export interface Props {
  animated?: boolean
  hidden?: boolean
  translucent?: boolean
  color?: string
  blackText?: boolean
}

(MyStatusBar as DefaultProps<Props>).defaultProps = {
  animated: true,
  hidden: false,
  translucent: true,
  color: 'transparent',
  blackText: false
}

type FinalProps = Props

function MyStatusBar(props: PropsWithChildren<FinalProps>) {
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT

  return (
    <>
      <StatusBar
        animated={props.animated} // 指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
        hidden={props.hidden} // 是否隐藏状态栏。
        backgroundColor={props.color} // 状态栏的背景色
        translucent={true}// 指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
        barStyle={`${props.blackText ? 'dark' : 'light'}-content` as any}
      />
      {!props.translucent && !props.hidden ? <View style={{ backgroundColor: props.color, height: statusBarHeight }} /> : null} 
    </>
  )
}

export default MyStatusBar