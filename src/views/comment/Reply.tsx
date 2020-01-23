import React, { PropsWithChildren, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import StatusBar from '~/components/StatusBar'
import { commentHOC, CommentConnectedProps } from '~/redux/comment/HOC'
import Item from './components/Item'
import Editor, { CommentEditorRef } from './components/Editor'
import Header from './components/Header'
import format from './utils/format'

export interface Props {

}

export interface RouteParams {
  signedName: string
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & CommentConnectedProps

function CommentReply(props: PropsWithChildren<FinalProps>) {
  const [replyId, setReplyId] = useState('')
  const refs = {
    editor: useRef<CommentEditorRef>()
  }
  const signedName = props.navigation.getParam('signedName')

  function addReply(replyId = '') {
    if (!signedName) {
      return $dialog.confirm.show({
        content: '需要先登录才能回复，是否前往登录界面？',
        onTapCheck: () => props.navigation.push('login')
      })
    }
    
    refs.editor.current!.show()
    
    setReplyId(replyId)
    setTimeout(refs.editor.current!.show)
  }

  function delCommentData(id: string) {
    props.$comment.del(id, true)
  }

  const state = props.$comment.getActiveData()
  const activeComment = state.tree.tree.filter(item => item.id === state.activeId)[0]
  const children = format.children(activeComment.children, state.activeId)

  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <StatusBar />
      <Header title={'回复：' + activeComment.username} onTapAddComment={addReply} navigation={props.navigation} />
      <Editor getRef={refs.editor}
        pageId={state.pageId}
        targetId={replyId || state.activeId}  
        onPosted={() => props.$comment.incrementLoad(true)}
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
          {children.length !== 0 ? <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginVertical: 10 }}>回复</Text> : null}
        </View>
        
        {children.map(item => <Item isReply visibleReply={false} visibleReplyNum={false}
          key={item.id}
          data={item}
          navigation={props.navigation}
          onDel={delCommentData}
          signedName={signedName} 
          onTapReply={() => addReply(item.id)}
        />)}

        <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>
          {children.length === 0 ? '还没有回复哦' : '已经没有啦'}
        </Text>
      </ScrollView>
    </View>
  )
}

export default commentHOC(CommentReply)

const styles = StyleSheet.create({
  
})