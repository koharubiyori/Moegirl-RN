import React, { PropsWithChildren, FC } from 'react'
import { NativeModules, StatusBar, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import store from '~/mobx'

export interface Props {
  animated?: boolean
  hidden?: boolean
  translucent?: boolean
  color?: string
  blackText?: boolean
}

;(MyStatusBar as DefaultProps<Props>).defaultProps = {
  animated: true,
  hidden: false,
  translucent: true,
  color: 'transparent',
  blackText: false
}

function MyStatusBar(props: PropsWithChildren<Props>) {
  return useObserver(() =>
    <StatusBar
      animated={props.animated}
      hidden={props.hidden}
      backgroundColor={props.color}
      translucent={true}
      barStyle={(props.blackText && store.settings.theme !== 'night') ? 'dark-content' : 'light-content'}
    />
  )
}

export default MyStatusBar