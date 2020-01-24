import React, { useState, MutableRefObject, PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import Dialog from 'react-native-dialog'

Alert.propTypes = {
  getRef: PropTypes.object
}

export interface Props {
  getRef: MutableRefObject<any>
}

export interface ShowFnOptions {
  title?: string
  content?: string
  checkText?: string
  onTapCheck? (): void
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
    onTapCheck: () => {}
  })

  if (props.getRef) props.getRef.current = { show, hide }

  function show({
    title = '提示',
    content = '',
    checkText = '确定',
    onTapCheck = () => {}
  }) {
    setVisible(true)
    setParams({ title, content, checkText, onTapCheck: () => { onTapCheck(); hide() } })
  }

  function hide() {
    setVisible(false)
  }

  return (
    <Dialog.Container visible={visible}
      onBackButtonPress={hide}
      onBackdropPress={hide}
    >
      <Dialog.Title>{params.title}</Dialog.Title>
      <Dialog.Description>{params.content}</Dialog.Description>
      <Dialog.Button label={params.checkText} onPress={params.onTapCheck} style={{ color: $colors.main }} />
    </Dialog.Container>
  )
}

export default Alert