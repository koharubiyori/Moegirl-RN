import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useTheme, Text } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { postComment } from '~/api/comment'
import toast from '~/utils/toast'

export interface Props {
  visible: boolean
  targetId?: string
  pageId: number
  onPosted(): void
  onDismiss(): void
}

type FinalProps = Props & __Navigation.InjectedNavigation

function CommentEditor(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
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
      $dialog.confirm.show({
        content: '关闭后当前编辑的评论内容将不会保存，是否关闭？',
        onPressCheck: props.onDismiss
      })
    } else {
      props.onDismiss()
    }
  }

  function submit() {
    if (inputText.length === 0) return toast.show('评论或回复内容不能为空')
    if (inputText === '0') { return toast.show('因萌百评论系统的bug，不能以“0”作为评论内容') }

    toast.showLoading('提交中')
    postComment(props.pageId, inputText, props.targetId)
      .finally(toast.hide)
      .then(() => {
        setTimeout(() => toast.show('发表成功'))
        setInputText('')
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
    visible ? <>
      <TouchableWithoutFeedback onPress={tapMaskToCloseSelf} style={{ ...styles.container }}>
        {/* 这里的错误暂时没找到办法消掉 */}
        <Animated.View style={{ ...styles.container, opacity: transitionOpacity }} ref={refs.mask}>
          <Animated.View style={{ ...styles.body, backgroundColor: theme.colors.background, transform: [{ translateY: transitionTranslateY }] }}>
            <TextInput multiline disableFullscreenUI 
              style={{ 
                ...styles.input, 
                borderColor: theme.colors.placeholder,
                color: theme.colors.text 
              }} 
              autoCorrect={false}
              placeholder="说点什么吧..."
              placeholderTextColor={theme.colors.placeholder}
              textAlignVertical="top" 
              onChangeText={setInputText}
              ref={refs.textInput}
            />
            
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity onPress={submit}>
                {/* 这里颜色是正确的，但不符合语义 */}
                <Text style={{ color: theme.colors[inputText.length ? 'disabled' : 'placeholder'], fontSize: 17, marginBottom: 10 }}>提交</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </> : null
  )
}

export default withNavigation(CommentEditor) as FC<Props>

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
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