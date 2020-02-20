import React, { MutableRefObject, PropsWithChildren, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Dialog, TextInput } from 'react-native-paper'

export interface Props {
  getRef: MutableRefObject<any>
}

export interface ConfirmRef {
  show (options: ShowFnOptions): void
  hide (): void
}

export interface ShowFnOptions {
  title?: string
  content?: string
  checkText?: string
  closeText?: string
  onPressCheck?: (inputVal?: string) => void
  onPressClose?: () => void
  inputPlaceholder?: string
  hasInput?: boolean
}

type FinalProps = Props

function Confirm(props: PropsWithChildren<FinalProps>) {
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState<ShowFnOptions>({
    title: '',
    content: '',
    checkText: '',
    closeText: '',
    onPressCheck: () => {},
    onPressClose: () => {},
    inputPlaceholder: '',
    hasInput: false,
  })
  const [inputVal, setInputVal] = useState('')

  if (props.getRef) props.getRef.current = { show, hide }

  function show ({
    title = '提示',
    content = '',
    checkText = '确定',
    closeText = '取消',
    onPressCheck = () => {},
    onPressClose = () => {},
    hasInput = false,
    inputPlaceholder,
  }: ShowFnOptions) {
    setVisible(true)
    setParams({ 
      title, 
      content, 
      checkText, 
      onPressCheck: inputVal => { onPressCheck(inputVal); hide() }, 
      closeText, 
      onPressClose: () => { onPressClose(); hide() },
      hasInput, 
      inputPlaceholder
    })
  }

  function hide() {
    setVisible(false)
  }

  const { title, content, checkText, closeText, onPressCheck, onPressClose, hasInput, inputPlaceholder } = params
  return (
    // <Dialog.Container visible={visible} 
    //   onBackButtonPress={hide}
    //   onBackdropPress={hide}
    // >
    //   <Dialog.Title>{title!}</Dialog.Title>
    //   {content ? <Dialog.Description>{content}</Dialog.Description> : null}
    //   {hasInput ? <>
    //     <Dialog.Input autoFocus placeholder={inputPlaceholder} value={inputVal} 
    //       onChangeText={setInputVal}
    //       wrapperStyle={styles.input}
    //     />
    //   </> : null}
    //   <Dialog.Button label={closeText!} onPress={onPressClose!} style={{ marginRight: 10, color: '#ABABAB' }} />
    //   <Dialog.Button label={checkText!} onPress={() => onPressCheck!(inputVal)} style={{ color: $colors.primary }} />
    // </Dialog.Container>
    <Dialog
      visible={visible}
      onDismiss={hide}
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
            style={styles.input}
          />
        </> : null}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={params.onPressClose} style={{ marginRight: 10 }} color="#ccc">{params.closeText}</Button>
        <Button onPress={params.onPressCheck}>{params.checkText}</Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default Confirm

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white'
  }
})