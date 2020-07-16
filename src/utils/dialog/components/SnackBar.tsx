import React, { forwardRef, PropsWithChildren, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import useStateWithRef from '~/hooks/useStateWithRef'
import { colors } from '~/theme'

export interface Props {
  
}

export interface SnackBarOptions {
  title: string
  actionText?: string
}

export interface SnackBarRef {
  show (options: SnackBarOptions): Promise<void>
  hide (): void
}

function MySnackBar(props: PropsWithChildren<Props>, ref: any) {
  const [visible, setVisible, visibleRef] = useStateWithRef(false)
  const [params, setParams] = useState({
    title: '',
    actionText: '',
    actionHandler: () => {},
    hideHandler: () => {}
  })
  const queue = useRef<(typeof params)[]>([])

  useImperativeHandle<any, SnackBarRef>(ref, () => ({ show, hide }))

  // 使用一个队列，每500秒check一次，如果有则显示
  useEffect(() => {
    const intervalKey = setInterval(() => {
      if (!visibleRef.current) {
        if (queue.current.length > 0) {
          setVisible(true)
          setParams(queue.current.pop()!)
          setTimeout(() => setVisible(false), 3500)
        }
      }
    }, 500)

    return () => clearInterval(intervalKey)
  }, [])

  function show({
    title,
    actionText = ''
  }: SnackBarOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      queue.current.push({
        title,
        actionText,
        actionHandler: resolve,
        hideHandler: reject
      })
    }).finally(hide)
  }

  function hide() {
    setVisible(false)
  }
  
  return (
    <SnackBar
      accentColor={colors.night.accent}
      visible={visible}
      textMessage={params.title}
      actionText={params.actionText}
      actionHandler={params.hideHandler}
    />
    // <Snackbar
    //   style={styles.body}
    //   wrapperStyle={{
    //     ...styles.wrapper,
    //   }}
    //   visible={visible}
    //   duration={3000}
    //   theme={{ colors: { accent: colors.night.accent } }}
    //   onDismiss={() => setVisible(false)}
    //   action={params.actionText ? {
    //     label: params.actionText,
    //     onPress: params.actionHandler,
    //   } : undefined}
    // >
    //   <Text style={styles.text}>{params.title}</Text>
    //   {params.actionText && 
    //     <Text style={styles.btn} onPress={params.actionHandler}>{params.actionText}</Text>
    //   }
    // </Snackbar>
  )
}

export default forwardRef(MySnackBar)

const styles = StyleSheet.create({
  wrapper: {

  },
  
  body: {
    backgroundColor: colors.night.primary,
    paddingVertical: 5,
    paddingLeft: 10,
  },

  text: {
    color: colors.night.text,
    fontSize: 16
  },

  btn: {
    fontSize: 17,
    color: colors.night.accent,
    fontWeight: 'bold',
  }
})