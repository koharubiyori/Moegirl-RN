import React, { PropsWithChildren, useImperativeHandle, useState, forwardRef } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Dialog, Text, TextInput, useTheme } from 'react-native-paper'

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
  inputPlaceholder?: string
  hasInput?: boolean
  autoClose?: boolean
}

function ConfirmDialog(props: PropsWithChildren<Props>, ref: any) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState({
    title: '',
    content: '',
    checkText: '',
    closeText: '',
    checkHandler: (inputVal: string) => {},
    closeHandler: () => {},
    inputPlaceholder: '',
    hasInput: false,
  })
  const [inputVal, setInputVal] = useState('')

  useImperativeHandle<any, ConfirmDialogRef>(ref, () => ({ show, hide }))

  function show ({
    title = '提示',
    content = '',
    checkText = '确定',
    closeText = '取消',
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
        hasInput, 
        inputPlaceholder,
        checkHandler: (inputVal: string) => {
          autoClose && hide()
          resolve(hasInput ? inputVal : undefined)
        }, 
        closeHandler: () => { autoClose && hide(); reject() },
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
        <Button onPress={params.closeHandler} style={{ marginRight: 10 }} color="#ccc">
          <Text style={{ fontSize: 16 }}>{params.closeText}</Text>
        </Button>
        
        <Button onPress={() => params.checkHandler(inputVal)}>
          <Text style={{ fontSize: 16, color: theme.colors.accent }}>{params.checkText}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default forwardRef(ConfirmDialog)

const styles = StyleSheet.create({

})