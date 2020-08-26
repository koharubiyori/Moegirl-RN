import React, { forwardRef, PropsWithChildren, useImperativeHandle, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Dialog, Text, TextInput, useTheme } from 'react-native-paper'
import i from './lang'

export interface Props {

}

export interface ConfirmDialogRef {
  show (options: ConfirmOptions, autoClose?: boolean): Promise<string | undefined>
  hide (): void
}

export interface ConfirmOptions {
  title?: string
  content?: string
  checkText?: string
  closeText?: string
  leftText?: string
  inputPlaceholder?: string
  hasInput?: boolean
  autoClose?: boolean
  leftHandler?(): void
}

function ConfirmDialog(props: PropsWithChildren<Props>, ref: any) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState({
    title: '',
    content: '',
    checkText: '',
    closeText: '',
    leftText: '',
    leftHandler: () => {},
    checkHandler: (inputVal: string) => {},
    closeHandler: () => {},
    inputPlaceholder: '',
    hasInput: false,
  })
  const [inputVal, setInputVal] = useState('')

  useImperativeHandle<any, ConfirmDialogRef>(ref, () => ({ show, hide }))

  function show ({
    title = i.title,
    content = '',
    checkText = i.check,
    closeText = i.close,
    leftText = '',
    leftHandler = () => {},
    hasInput = false,
    inputPlaceholder = '',
    autoClose = true
  }: ConfirmOptions): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      setVisible(true)
      setParams({ 
        title, 
        content, 
        checkText, 
        closeText, 
        leftText,
        hasInput, 
        inputPlaceholder,
        checkHandler: (inputVal: string) => {
          autoClose && hide()
          resolve(hasInput ? inputVal : undefined)
        }, 
        closeHandler: () => { autoClose && hide(); reject() },
        leftHandler: () => { autoClose && hide(); leftHandler() }
      })
    })
  }

  function hide() {
    setVisible(false)
    params.closeHandler()
  }

  return (
    <Dialog
      visible={visible}
      onDismiss={hide}
      style={{ paddingHorizontal: 10 }}
    >
      <Dialog.Title>{params.title}</Dialog.Title>
      <Dialog.Content>
        {params.content ? <>
          <Text style={{ fontSize: 15 }}>{params.content}</Text>
        </> : null}

        {params.hasInput ? <>
          <TextInput autoFocus
            value={inputVal} 
            placeholder={params.inputPlaceholder} 
            onChangeText={setInputVal}
            style={{
              backgroundColor: 'transparent'
            }}
          />
        </> : null}
      </Dialog.Content>
      <Dialog.Actions>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onPress={params.closeHandler} color="#ccc">
            <Text style={{ fontSize: 16 }}>{params.closeText}</Text>
          </Button>
          
          <Button onPress={() => params.checkHandler(inputVal)}>
            <Text style={{ fontSize: 16, color: theme.colors.accent }}>{params.checkText}</Text>
          </Button>
        </View>
      </Dialog.Actions>
      {!!params.leftText &&
        <Button style={styles.leftBtn} onPress={params.leftHandler}>
          <Text style={{ fontSize: 16, color: theme.colors.placeholder }}>{params.leftText}</Text>
        </Button>
      }
    </Dialog>
  )
}

export default forwardRef(ConfirmDialog)

const styles = StyleSheet.create({
  leftBtn: {
    position: 'absolute', 
    left: 16, 
    bottom: 8.5,
  }
})