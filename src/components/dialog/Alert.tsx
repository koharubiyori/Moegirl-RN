import React, { MutableRefObject, PropsWithChildren, useState } from 'react'
import { Button, Dialog, Text, useTheme } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'

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
  const theme = useTheme()
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

  const maxHeight = Dimensions.get('window').height * 0.7
  return (
    <Dialog
      visible={visible}
      onDismiss={hide}
      style={{ marginHorizontal: 20, paddingHorizontal: 10, maxHeight }}
    >
      <Dialog.Title>{params.title}</Dialog.Title>

      <Dialog.Content>
        <ScrollView style={{ maxHeight: maxHeight - 160 }}>
          <Text style={{ fontSize: 15 }}>{params.content}</Text>
        </ScrollView>
      </Dialog.Content>
      
      <Dialog.Actions>
        <Button onPress={params.onPressCheck}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{params.checkText}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default Alert