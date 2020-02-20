import React, { MutableRefObject, PropsWithChildren, useState } from 'react'
import { Text } from 'react-native'
import { Button, Dialog } from 'react-native-paper'

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
    <Dialog
      visible={visible}
      onDismiss={hide}
      style={{ marginHorizontal: 40 }}
    >
      <Dialog.Title>{params.title}</Dialog.Title>
      <Dialog.Content>
        <Text style={{ fontSize: 15 }}>{params.content}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={params.onPressCheck}>
          <Text style={{ fontSize: 16 }}>{params.checkText}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default Alert