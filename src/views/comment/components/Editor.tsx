import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import dialog from '~/utils/dialog'
import toast from '~/utils/toast'
import i from '../lang'

export interface Props {
  visible: boolean
  targetId?: string
  pageId: number
  onPosted(): void
  onDismiss(): void
}

function CommentEditor(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const [visible, setVisible] = useState(false) // 组件内拥有一个独立的visible
  const [inputText, setInputText] = useState('')
  const [transitionOpacity] = useState(new Animated.Value(0))
  const [transitionTranslateY] = useState(new Animated.Value(120))
  const refs = {
    mask: useRef<any>(),
    textInput: useRef<any>()
  }
  const lastProps = useRef(props)

  useEffect(() => {
    // 监听props.visible的变化，改变内部的visible
    if (lastProps.current.visible !== props.visible) {
      props.visible ? show() : hide()
    }

    lastProps.current = props
  })

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
    if (inputText) {
      dialog.confirm.show({
        content: i.editor.closeHint
      })
        .then(props.onDismiss)
    } else {
      props.onDismiss()
    }
  }

  function submit() {
    if (inputText.length === 0) return toast(i.editor.submit.emptyMsg)
    if (inputText === '0') { return toast(i.editor.submit.zeroMsg) }

    dialog.loading.show({ title: i.editor.submit.submitting })
    store.comment.addComment(props.pageId, inputText, props.targetId)
      .finally(dialog.loading.hide)
      .then(() => {
        setInputText('')
        props.onPosted()
      })
      .catch(e => {
        console.log(e)
        toast(i.editor.submit.netErr, 'center')
      })
  }

  function tapMaskToCloseSelf(e: any) {
    // 这里需要_nativeTag判断点击的是mask还是输入栏
    refs.mask.current._nativeTag === e.target._nativeTag && close()
  }

  return (
    visible ? <>
      <TouchableWithoutFeedback onPress={tapMaskToCloseSelf} style={{ ...styles.container }}>
        {/* 这里的ref属性错误暂时没找到办法消掉 */}
        <Animated.View style={{ ...styles.container, opacity: transitionOpacity }} ref={refs.mask}>
          <Animated.View style={{ ...styles.body, backgroundColor: theme.colors.background, transform: [{ translateY: transitionTranslateY }] }}>
            <TextInput multiline disableFullscreenUI 
              style={{ 
                ...styles.input, 
                borderColor: theme.colors.placeholder,
                color: theme.colors.text 
              }} 
              autoCorrect={false}
              placeholder={i.editor.placeholder}
              placeholderTextColor={theme.colors.placeholder}
              textAlignVertical="top" 
              onChangeText={setInputText}
              ref={refs.textInput}
            />
            
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity onPress={submit}>
                {/* 这里颜色是正确的，但不符合语义 */}
                <Text style={{ color: theme.colors[inputText.length ? 'disabled' : 'placeholder'], fontSize: 17, marginBottom: 10 }}>{i.editor.submitBtn}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </> : null
  )
}

export default CommentEditor

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100
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