import React, { forwardRef, PropsWithChildren, useEffect, useImperativeHandle, useState } from 'react'
import { BackHandler, Dimensions, StyleSheet } from 'react-native'
import { Dialog, Text, useTheme } from 'react-native-paper'
import MyActivityIndicator from '~/components/MyActivityIndicator'
import useStateWithRef from '~/hooks/useStateWithRef'

export interface Props {

}

export interface LoadingOptions {
  title?: string
  allowUserClose?: boolean
}

export interface LoadingDialogRef {
  show (options?: LoadingOptions): Promise<void>
  hide (): void
}

function LoadingDialog(props: PropsWithChildren<Props>, ref: any) {
  const theme = useTheme()
  const [visible, setVisible, visibleRef] = useStateWithRef(false)
  const [params, setParams] = useState({
    title: '',
    allowUserClose: false,
    byHideHandler: () => {},
    byUserHandler: () => {}
  })

  useImperativeHandle<any, LoadingDialogRef>(ref, () => ({ show, hide }))

  useEffect(() => {    
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visibleRef.current && params.allowUserClose) setVisible(false)
      return true
    })

    return () => listener.remove()
  }, [])

  function show(options: LoadingOptions = {}): Promise<void> {
    const title = options.title || '请稍候...'
    const allowUserClose = options.allowUserClose || false
    
    setVisible(true)
    return new Promise((resolve, reject) => {
      setParams({ 
        title, 
        allowUserClose,
        byHideHandler: resolve,
        byUserHandler: reject 
      })
    })
  }

  function hide() {
    setVisible(false)
    params.byHideHandler()
  }

  function hideForUser() {
    setVisible(false)
    params.byUserHandler()
  }

  const maxHeight = Dimensions.get('window').height * 0.7
  return (
    <Dialog
      visible={visible}
      dismissable={params.allowUserClose}
      onDismiss={hideForUser}
      style={{ maxHeight, ...styles.container }}
    >
      <MyActivityIndicator style={{ marginLeft: 20 }} />
      <Text style={{ marginLeft: 20, fontSize: 16 }}>{params.title}</Text>
    </Dialog>
  )
}

export default forwardRef(LoadingDialog)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20, 
    padding: 10, 
    flexDirection: 'row',
    alignItems: 'center'
  }
})