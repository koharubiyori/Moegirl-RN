import React, { useState, MutableRefObject, PropsWithChildren } from 'react'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import Dialog from 'react-native-dialog'

export interface Props {
  getRef: MutableRefObject<any>
}

export interface ShowFnOptions {
  title?: string
  content?: string
  checkText?: string
  onPressCheck? (): void
  onClose? (): void
}

export interface AlertRef {
  show (options: ShowFnOptions): void
  hide (): void
}

type FinalProps = Props

function Alert(props: PropsWithChildren<FinalProps>) {
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState({
    title: '',
    content: '',
    checkText: '',
    onPressCheck: () => {},
    onClose: () => {}
  })

  if (props.getRef) props.getRef.current = { show, hide }

  function show({
    title = '提示',
    content = '',
    checkText = '确定',
    onPressCheck = () => {},
    onClose = () => {}
  }) {
    setVisible(true)
    setParams({ title, content, checkText, onClose, onPressCheck: () => { onPressCheck(); hide() } })
  }

  function hide() {
    params.onClose()
    setVisible(false)
  }

  return (
    <Dialog.Container visible={visible}
      onBackButtonPress={hide}
      onBackdropPress={hide}
    >
      <Dialog.Title>{params.title}</Dialog.Title>
      <Dialog.Description>{params.content}</Dialog.Description>
      <Dialog.Button label={params.checkText} onPress={params.onPressCheck} style={{ color: $colors.primary }} />
    </Dialog.Container>
  )
}

export default Alert