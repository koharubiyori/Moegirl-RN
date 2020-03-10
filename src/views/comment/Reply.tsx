import React, { PropsWithChildren, useRef, useState } from 'react'
import { LayoutAnimation, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import StatusBar from '~/components/StatusBar'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'
import store from '~/redux'
import { CommentConnectedProps, commentHOC } from '~/redux/comment/HOC'
import Editor from './components/Editor'
import Header from './components/Header'
import Item from './components/Item'
import format from './utils/format'

export interface Props {

}

export interface RouteParams {
  signedName: string
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & CommentConnectedProps

function CommentReply(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [replyId, setReplyId] = useState('')
  const [visibleEditor, setVisibleEditor] = useState(false)
  const signedName = store.getState().user.name

  useLayoutAnimation(
    LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
  )

  function addReply(replyId = '') {
    if (!signedName) {
      return $dialog.confirm.show({
        content: '需要先登录才能回复，是否前往登录界面？',
        onPressCheck: () => props.navigation.push('login')
      })
    }
    
    setReplyId(replyId)
    setVisibleEditor(true)
  }

  function delCommentData(id: string) {
    props.$comment.del(id, true)
  }

  const state = props.$comment.getActiveData()
  const activeComment = state.tree.tree.filter(item => item.id === state.activeId)[0]
  const children = format.children(activeComment.children, state.activeId)

  return (
    <ViewContainer grayBgColor>
      <StatusBar />
      <Header title={'回复：' + activeComment.username} onPressAddComment={addReply} navigation={props.navigation} />
      <Editor
        visible={visibleEditor}
        pageId={state.pageId}
        targetId={replyId || state.activeId}  
        onDismiss={() => setVisibleEditor(false)}
        onPosted={() => { props.$comment.incrementLoad(true); setVisibleEditor(false) }}
      />
    
      <ScrollView style={{ flex: 1 }}>
        <View>
          <Item isReply 
            data={activeComment} 
            navigation={props.navigation} 
            visibleReply={false} 
            visibleReplyBtn={false} 
            visibleDelBtn={false} 
            signedName={signedName} 
            onDel={delCommentData}
          />
          {children.length !== 0 ? <Text style={{ fontSize: 18, marginLeft: 20, color: theme.colors.disabled, marginVertical: 10 }}>回复</Text> : null}
        </View>
        
        {children.map(item => <Item isReply 
          key={item.id}
          visibleReply={false} 
          visibleReplyNum={false}
          data={item}
          navigation={props.navigation}
          onDel={delCommentData}
          signedName={signedName} 
          onPressReply={() => addReply(item.id)}
        />)}

        <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>
          {children.length === 0 ? '还没有回复哦' : '已经没有啦'}
        </Text>
      </ScrollView>
    </ViewContainer>
  )
}

export default commentHOC(CommentReply)

const styles = StyleSheet.create({
  
})