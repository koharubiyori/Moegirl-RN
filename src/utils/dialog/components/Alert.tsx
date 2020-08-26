import React, { forwardRef, PropsWithChildren, useImperativeHandle, useState, useEffect } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { Button, Dialog, Text, useTheme } from 'react-native-paper'
import i from './lang'

export interface Props {

}

export interface AlertOptions {
  title?: string
  content?: string
  checkText?: string
  autoClose?: boolean
}

export interface AlertDialogRef {
  show (options: AlertOptions, autoClose?: boolean): Promise<void>
  hide (): void
}

function AlertDialog(props: PropsWithChildren<Props>, ref: any) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState({
    title: '',
    content: '',
    checkText: '',
    checkHandler: () => {},
    closeHandler: () => {}
  })

  useImperativeHandle<any, AlertDialogRef>(ref, () => ({ show, hide }))

  function show({
    title = i.title,
    content = '',
    checkText = i.check,
    autoClose = true
  }: AlertOptions): Promise<void> {
    setVisible(true)
    return new Promise((resolve, reject) => {
      setParams({ 
        title, 
        content, 
        checkText, 
        checkHandler: () => { autoClose && hide(); resolve() },
        closeHandler: () => { autoClose && hide(); reject() }
      })
    })
  }

  function hide() {
    setVisible(false)
    params.closeHandler()
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
        <Button onPress={params.checkHandler}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{params.checkText}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default forwardRef(AlertDialog)