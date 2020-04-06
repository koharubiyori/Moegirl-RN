import React, { FC, PropsWithChildren, useRef } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme, Text } from 'react-native-paper'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import * as commentApi from '~/api/comment'
import { CommentConnectedProps, commentHOC } from '~/redux/comment/HOC'
import toast from '~/utils/toast'
import format from '../utils/format'
import { AVATAR_URL } from '~/constants'

export interface Props {
  data: any
  isReply?: boolean
  visibleReply?: boolean
  visibleReplyBtn?: boolean
  visibleReplyNum?: boolean
  visibleDelBtn?: boolean
  navigation: __Navigation.Navigation
  signedName: string | null
  pageId: number
  onDel?(commentId: string): void
  onPressReply?(commentId: string): void
}

(CommentItem as DefaultProps<Props>).defaultProps = {
  visibleReply: true,
  visibleReplyBtn: true,
  visibleReplyNum: true,
  visibleDelBtn: true,
  isReply: false
}

type FinalProps = Props & CommentConnectedProps

function CommentItem(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const isReported = useRef(false)

  function toggleLike() {
    if (!props.signedName) {
      return $dialog.confirm.show({
        content: '未登录无法进行点赞，是否要前往登录界面？',
        onPressCheck: () => props.navigation.push('login')
      })
    }
    
    var isLiked = props.data.myatt
    
    toast.showLoading()
    commentApi.toggleLike(props.data.id, isLiked)
      .finally(toast.hide)
      .then(data => {
        props.$comment.setLikeStatus(props.pageId, props.data.id, !isLiked)
      }).catch(e => {
        console.log(e)
        setTimeout(() => toast.show('网络错误'))
      })
  }

  function report() {
    if (isReported.current) { return toast.show('不能重复举报') }
    
    $dialog.confirm.show({ 
      content: `确定要举报这条${props.isReply ? '回复' : '评论'}吗？`,
      onPressCheck: () => {
        toast.showLoading()
        commentApi.report(props.data.id)
          .finally(() => toast.hide())
          .then(() => {
            isReported.current = true
            // 这里如果不做延时会受到toast.hide()的影响，造成alert不显示，且界面被一个透明遮罩层挡上
            setTimeout(() => $dialog.alert.show({ content: '已举报' }))
          })
          .catch(() => toast.show('网络错误，请重试'))
      }
    })
  }

  function del() {
    $dialog.confirm.show({
      content: `确定要删除自己的这条${props.isReply ? '回复' : '评论'}吗？`,
      onPressCheck: () => {
        toast.showLoading()
        commentApi.delComment(props.data.id)
          .finally(() => toast.hide())
          .then(() => {
            props.onDel && props.onDel(props.data.id)
            setTimeout(() => $dialog.alert.show({ content: `${props.isReply ? '回复' : '评论'}已删除` }))
          })
          .catch(e => {
            console.log(e)
            toast.show('网络错误，请重试')
          })
      }
    })    
  }

  const iconSize = 20
  const { data } = props
  const { myatt: isLiked, like: likeNum } = data
  const formattedChildren = format.children(data.children || [], data.id)
  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.surface }}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => props.navigation.push('article', { link: 'User:' + data.username })}>
              <Image source={{ uri: AVATAR_URL + data.username }} style={{ ...styles.avatar, backgroundColor: theme.colors.lightBg }} />
            </TouchableOpacity>
            <View>
              <Text>{data.username}</Text>
              <Text style={{ color: theme.colors.disabled, marginTop: 3 }}>{format.date(data.timestamp)}</Text>
            </View>
          </View>

          {props.visibleDelBtn && props.data.username === props.signedName ? <>
            <TouchableOpacity onPress={del}>
              <MaterialIcon name="clear" color={theme.colors.placeholder} size={iconSize} />
            </TouchableOpacity>
          </> : null}
        </View>
      </View>

      <View style={styles.main}>
        <Text>
          {props.data.targetName ? <>
            <Text style={{ color: theme.colors.disabled }}>
              <Text>回复 </Text>
              <Text style={{ color: theme.colors.accent }}>{props.data.targetName}：</Text>
            </Text>
          </> : null}
          
          <Text>{format.content(data.text)}</Text>
        </Text>
      </View>

      {props.visibleReply && props.data.children && props.data.children.length !== 0 ? <>
        <View style={{ ...styles.reply, backgroundColor: theme.colors.lightBg }}>
          {formattedChildren.filter((_, ind) => ind < 3).map(item =>
            <View key={item.id} style={{ marginVertical: 2 }}>
              <Text>
                <Text style={{ color: theme.colors.accent }}>{item.username}</Text>
                {item.targetName ? <Text> 回复 </Text> : null}
                {item.targetName ? <Text style={{ color: theme.colors.accent }}>{item.targetName}</Text> : null}
                <Text style={{ color: theme.colors.accent }}>：</Text>
                <Text>{format.content(item.text)}</Text>
              </Text>
            </View>
          )}

          {formattedChildren.length > 3
            ? <TouchableOpacity onPress={() => props.onPressReply && props.onPressReply(data.id)}>
              <Text style={{ color: theme.colors.disabled, textAlign: 'center', marginTop: 10 }}>查看更多</Text>
            </TouchableOpacity>
            : null}
        </View>
      </> : null}

      <View style={styles.footer}>
        <TouchableOpacity style={{ ...styles.footerItem, position: 'relative', top: 1 }} 
          onPress={toggleLike}
        >
          {likeNum === 0 ? <AntDesignIcon name="like2" color={theme.colors.placeholder} size={iconSize} /> : null}
          {likeNum > 0 && !isLiked ? <AntDesignIcon name="like2" color={theme.colors.accent} size={iconSize} /> : null}
          {isLiked ? <AntDesignIcon name="like1" color={theme.colors.accent} size={iconSize} /> : null}
          {likeNum > 0 ? <Text style={{ color: theme.colors.accent, marginLeft: 5 }}>{likeNum}</Text> : null}
        </TouchableOpacity>

        {props.visibleReplyBtn ? <>
          <TouchableOpacity style={styles.footerItem}
            onPress={() => props.onPressReply && props.onPressReply(data.id)}
          >
            {!props.visibleReplyNum || data.children.length === 0 
              ? <FontAwesomeIcon name="comment-o" color={theme.colors.placeholder} size={iconSize} />
              : <>
                <FontAwesomeIcon name="comment" color={theme.colors.accent} size={iconSize} />
                <Text style={{ color: theme.colors.accent, marginLeft: 5 }}>{data.children.length}</Text>
              </>
            }
          </TouchableOpacity>
        </> : null}

        <TouchableOpacity style={styles.footerItem} onPress={report}>
          <AntDesignIcon name="flag" color={theme.colors.placeholder} size={iconSize} /> 
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default commentHOC(CommentItem) as FC<Props>

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 1
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