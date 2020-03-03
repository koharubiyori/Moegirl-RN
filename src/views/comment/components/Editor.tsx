import React, { FC, MutableRefObject, PropsWithChildren, useRef, useState } from 'react'
import { Animated, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { postComment } from '~/api/comment'
import toast from '~/utils/toast'

export interface Props {
  targetId?: string
  pageId: number
  onPosted (): void
  getRef: MutableRefObject<any>
}

export interface CommentEditorRef {
  show (): void
  hide (): void
}

type FinalProps = Props & __Navigation.InjectedNavigation

function CommentEditor(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const [transitionOpacity] = useState(new Animated.Value(0))
  const [transitionTranslateY] = useState(new Animated.Value(120))
  const refs = {
    mask: useRef<any>(),
    textInput: useRef<any>()
  }

  if (props.getRef) props.getRef.current = { show, hide }

  function show() {
    setVisible(true)
    Animated.timing(transitionOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start()
    Animated.timing(transitionTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }).start()
    setTimeout(() => refs.textInput.current.focus())
  }

  function hide() {
    Animated.timing(transitionOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start()
    Animated.timing(transitionTranslateY, { toValue: 120, duration: 300, useNativeDriver: true })
      .start(() => setVisible(false))
  }

  function close() {
    if (visible) {
      if (inputText) {
        $dialog.confirm.show({
          content: '关闭后当前编辑的评论内容将不会保存，是否关闭？',
          onPressCheck: hide
        })
      } else {
        hide()
      }
    } else {
      props.navigation.goBack()
    }
  }

  function submit() {
    if (inputText === '0') { return toast.show('因萌百评论系统的bug，不能以“0”作为评论内容') }

    toast.showLoading('提交中')
    postComment(props.pageId, inputText, props.targetId)
      .finally(toast.hide)
      .then(() => {
        setTimeout(() => toast.show('发表成功'))
        setInputText('')
        hide()

        props.onPosted()
      })
      .catch(e => {
        console.log(e)
        toast.show('网络错误，请重试', 'center')
      })
  }

  function tapMaskToCloseSelf(e: any) {
    refs.mask.current._component._nativeTag === e.target && close()
  }

  return (
    <Modal transparent visible={visible} onRequestClose={close}>
      <TouchableWithoutFeedback onPress={tapMaskToCloseSelf}>
        <Animated.View style={{ ...styles.container, opacity: transitionOpacity }} ref={refs.mask}>
          <Animated.View style={{ ...styles.body, backgroundColor: theme.colors.background, transform: [{ translateY: transitionTranslateY }] }}>
            <TextInput style={{ ...styles.input, borderColor: theme.colors.placeholder }} multiline disableFullscreenUI autoCorrect={false}
              placeholder="说点什么吧..."
              placeholderTextColor={theme.colors.placeholder}
              textAlignVertical="top" 
              onChangeText={setInputText}
              ref={refs.textInput}
            />
            
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity onPress={submit} disabled={inputText.length === 0}>
                {/* 这里颜色是正确的，但不符合语义 */}
                <Text style={{ color: theme.colors[inputText.length ? 'disabled' : 'placeholder'], fontSize: 17, marginBottom: 10 }}>提交</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default withNavigation(CommentEditor) as FC<Props>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },

  body: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 7,
    borderRadius: 10,
    paddingHorizontal: 7
  }
})