import PropTypes from 'prop-types'
import React, { MutableRefObject, PropsWithChildren, useState } from 'react'
import { StyleSheet } from 'react-native'
import Dialog from 'react-native-dialog'

Confirm.propTypes = {
  getRef: PropTypes.object
}

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
  onTapCheck?: (inputVal?: string) => void
  onTapClose?: () => void
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
    onTapCheck: () => {},
    onTapClose: () => {},
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
    onTapCheck = () => {},
    onTapClose = () => {},
    hasInput = false,
    inputPlaceholder,
  }: ShowFnOptions) {
    setVisible(true)
    setParams({ 
      title, 
      content, 
      checkText, 
      onTapCheck: inputVal => { onTapCheck(inputVal); hide() }, 
      closeText, 
      onTapClose: () => { onTapClose(); hide() },
      hasInput, 
      inputPlaceholder
    })
  }

  function hide() {
    setVisible(false)
  }

  const { title, content, checkText, closeText, onTapCheck, onTapClose, hasInput, inputPlaceholder } = params
  return (
    <Dialog.Container visible={visible} 
      onBackButtonPress={hide}
      onBackdropPress={hide}
    >
      <Dialog.Title>{title!}</Dialog.Title>
      {content ? <Dialog.Description>{content}</Dialog.Description> : null}
      {hasInput
        ? <Dialog.Input autoFocus placeholder={inputPlaceholder} value={inputVal} 
          onChangeText={setInputVal}
          wrapperStyle={styles.input}
        />
        : null}
      <Dialog.Button label={closeText!} onPress={onTapClose!} style={{ marginRight: 10, color: '#ABABAB' }} />
      <Dialog.Button label={checkText!} onPress={() => onTapCheck!(inputVal)} style={{ color: $colors.main }} />
    </Dialog.Container>
  )
}

export default Confirm

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: $colors.main,
    borderRadius: 5,
    paddingVertical: 0,
    paddingLeft: 5
  }
})