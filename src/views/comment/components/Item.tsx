import { useObserver } from 'mobx-react-lite'
import React, { PropsWithChildren, useRef, useState, MutableRefObject } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, StyleProp, ViewStyle, Animated, Easing, TouchableNativeFeedback } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { color } from 'react-native-reanimated'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import commentApi from '~/api/comment'
import { AVATAR_URL } from '~/constants'
import { useLayoutAnimationInMobx } from '~/hooks/useLayoutAnimation'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import { colors } from '~/theme'
import CommentTree, { CommentTreeDataWithTarget } from '~/utils/commentTree'
import dialog from '~/utils/dialog'
import { diffDate } from '~/utils/diffDate'
import toast from '~/utils/toast'

export interface Props {
  commentData: CommentTreeDataWithTarget
  isReply?: boolean
  visibleReply?: boolean
  visibleReplyBtn?: boolean
  visibleReplyNum?: boolean
  visibleDelBtn?: boolean
  pageId: number
  rootCommentId?: string 
  style?: StyleProp<ViewStyle>
  onPressReply?(commentId: string): void
  onPressTargetName?(): void
  getRefFn?(ref: any): void
}

export interface CommentItemRef {
  showBgColor(): void
}

;(CommentItem as DefaultProps<Props>).defaultProps = {
  visibleReply: true,
  visibleReplyBtn: true,
  visibleReplyNum: true,
  visibleDelBtn: true,
  isReply: false
}

const singleEmptyFn = () => {} // 这个函数用来作为最外层nativeFeedback触发onPress用

function CommentItem(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const isReported = useRef(false)
  const [bgColorOpacityTransition] = useState(new Animated.Value(0))

  if (props.getRefFn) props.getRefFn({ showBgColor })

  function showBgColor() {
    Animated.sequence([
      Animated.timing(bgColorOpacityTransition, { toValue: 0.5 }),
      Animated.timing(bgColorOpacityTransition, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear
      })
    ]).start()
  }

  function toggleLike() {
    if (!store.user.isLoggedIn) {
      return dialog.confirm.show({
        content: '未登录无法进行点赞，是否要前往登录界面？'
      })
        .then(() => navigation.push('login'))
    }
    
    const isLiked = !!props.commentData.myatt 
    dialog.loading.show()
    store.comment.setLike(props.pageId, props.commentData.id, !isLiked)
      .finally(dialog.loading.hide)
      .catch(() => toast('网络错误'))
  }

  async function report() {
    if (isReported.current) { return toast('不能重复举报') }
    
    await dialog.confirm.show({ content: `确定要举报这条${props.isReply ? '回复' : '评论'}吗？` })
    dialog.loading.show()
    commentApi.report(props.commentData.id)
      .finally(dialog.loading.hide)
      .then(() => {
        isReported.current = true
        // 这里如果不做延时会受到toast.hide()的影响，造成alert不显示，且界面被一个透明遮罩层挡上
        dialog.alert.show({ content: '已举报' })
      })
      .catch(() => toast('网络错误，请重试'))
  }

  async function delComment() {
    await dialog.confirm.show({
      content: `确定要删除自己的这条${props.isReply ? '回复' : '评论'}吗？`,
    })

    dialog.loading.show()
    store.comment.remove(props.pageId, props.commentData.id, props.rootCommentId!)
      .finally(dialog.loading.hide)
      .catch(() => toast('网络错误，请重试'))
  }

  function gotoCommentReplyPage() {
    navigation.push('commentReply', { 
      pageId: props.pageId,
      commentId: props.commentData.id 
    })
  }

  function handlerFor_replyBtn_wasClicked() {    
    if (props.commentData.children!.length === 0 || props.isReply) {
      if (!store.user.isLoggedIn) {
        return dialog.confirm.show({
          content: '未登录无法进行评论，是否要前往登录界面？'
        })
          .then(() => navigation.push('login'))
      }
      
      props.onPressReply && props.onPressReply(props.commentData.id)
    } else {
      gotoCommentReplyPage()
    }
  }

  function trimContent(text: string) {
    text = text.replace(/(<.+?>|<\/.+?>)/g, '')
      .replace(/&(.+?);/g, (s, s1: string) => (({
        gt: '>',
        lt: '<',
        amp: '&'
      } as any))[s1] || s)
  
    return text.trim()
  }

  const iconSize = 20
  return useObserver(() => {
    const commentData = props.commentData
    const likeNum = props.commentData.like
    const isLiked = !!props.commentData.myatt
    const replyList = commentData.children ? CommentTree.withTargetData(commentData.children, commentData.parentid) : []
    const isNight = store.settings.theme === 'night'

    return (
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(theme.colors.placeholder)} onPress={singleEmptyFn}>
        <View style={{ ...styles.container, backgroundColor: theme.colors.surface }}>
          <Animated.View style={{ ...styles.animateBgColor, backgroundColor: theme.colors.accent, opacity: bgColorOpacityTransition }} />
          <View style={styles.header}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.push('article', { pageName: 'User:' + commentData.username })}>
                  <Image source={{ uri: AVATAR_URL + commentData.username }} style={{ ...styles.avatar, backgroundColor: theme.colors.lightBg }} />
                </TouchableOpacity>
                <View>
                  <Text>{commentData.username}</Text>
                  <Text style={{ color: theme.colors.disabled, marginTop: 3 }}>{diffDate(new Date(commentData.timestamp * 1000))}</Text>
                </View>
              </View>

              {props.visibleDelBtn && commentData.username === store.user.name ? <>
                <TouchableOpacity onPress={delComment}>
                  <MaterialIcon name="clear" color={theme.colors.placeholder} size={iconSize} />
                </TouchableOpacity>
              </> : null}
            </View>
          </View>

          <View style={styles.main}>
            <Text>
              {commentData.target ? <>
                <Text style={{ color: theme.colors.disabled }}>
                  <Text>回复 </Text>
                  <Text style={{ color: theme.colors.accent }} onPress={props.onPressTargetName}>{commentData.target.username}：</Text>
                </Text>
              </> : null}
              
              <Text selectable>{trimContent(commentData.text)}</Text>
            </Text>
          </View>

          {props.visibleReply && commentData.children && commentData.children.length !== 0 ? <>
            <View style={{ ...styles.reply, backgroundColor: store.settings.theme === 'night' ? '#666' : theme.colors.lightBg }}>
              {replyList.filter((_, index) => index < 3).map(item =>
                <View key={item.id} style={{ marginVertical: 2 }}>
                  <Text>
                    <Text style={{ color: theme.colors.accent }}>{item.username}</Text>
                    {!!item.target && <Text> 回复 </Text>}
                    {!!item.target && <Text style={{ color: theme.colors.accent }}>{item.target.username}</Text>}
                    <Text style={{ color: theme.colors.accent }}>：</Text>
                    <Text>{trimContent(item.text)}</Text>
                  </Text>
                </View>
              )}

              {replyList.length > 3 && 
                <TouchableOpacity onPress={gotoCommentReplyPage}>
                  <Text style={{ color: theme.colors.disabled, textAlign: 'center', marginTop: 10 }}>查看更多</Text>
                </TouchableOpacity>
              }
            </View>
          </> : null}

          <View style={styles.footer}>
            <TouchableOpacity style={{ ...styles.footerItem, position: 'relative', top: 1 }} 
              onPress={toggleLike}
            >
              {likeNum === 0 && <AntDesignIcon name="like2" color={theme.colors.placeholder} size={iconSize} />}
              {(likeNum > 0 && !isLiked) && <AntDesignIcon name="like2" color={theme.colors.accent} size={iconSize} />}
              {isLiked && <AntDesignIcon name="like1" color={theme.colors.accent} size={iconSize} />}
              {likeNum > 0 && <Text style={{ color: theme.colors.accent, marginLeft: 5 }}>{likeNum}</Text>}
            </TouchableOpacity>

            {props.visibleReplyBtn ? <>
              <TouchableOpacity 
                style={styles.footerItem}
                onPress={handlerFor_replyBtn_wasClicked}
              >
                {!props.visibleReplyNum || commentData.children!.length === 0 
                  ? <FontAwesomeIcon name="comment-o" color={theme.colors.placeholder} size={iconSize} />
                  : <>
                    <FontAwesomeIcon name="comment" color={theme.colors.accent} size={iconSize} />
                    <Text style={{ color: theme.colors.accent, marginLeft: 5 }}>{replyList.length}</Text>
                  </>
                }
              </TouchableOpacity>
            </> : null}

            <TouchableOpacity style={styles.footerItem} onPress={report}>
              <AntDesignIcon name="flag" color={theme.colors.placeholder} size={iconSize} /> 
            </TouchableOpacity>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }) 
}

export default CommentItem

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 1
  },

  animateBgColor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10
  },

  main: {
    marginVertical: 15
  },

  icon: {
    width: 26,
    height: 26
  },

  footer: {
    flexDirection: 'row',
    height: 30,
    marginTop: 10
  },

  footerItem: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  reply: {
    flex: 1,
    marginLeft: 60,
    marginRight: 30,
    padding: 10
  }
})