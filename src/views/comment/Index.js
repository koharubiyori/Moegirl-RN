import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ActivityIndicator, FlatList, TouchableOpacity, 
  StyleSheet, LayoutAnimation, InteractionManager
} from 'react-native'
import toast from '~/utils/toast'
import StatusBar from '~/components/StatusBar'
import commentHOC from '~/redux/comment/HOC'
import store from '~/redux'
import * as commentActions from '~/redux/comment/actionTypes'
import Header from './Header'
import Editor from './Editor'
import Item from './components/Item'

function Comment(props){
  const refs = {
    editor: useRef()
  }
  const title = props.navigation.getParam('title')
  const signedName = store.getState().user.name

  useEffect(() =>{
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
    )
  })

  function loadList(){
    InteractionManager.runAfterInteractions(() =>{
      props.comment.load().catch(() => toast.show('加载失败，正在重试'))
    })
  }

  function addComment(){
    if(!signedName){
      return $dialog.confirm.show({
        content: '需要先登录才能发表评论，是否前往登录界面？',
        onTapCheck: () => props.navigation.push('login')
      })
    }

    refs.editor.current.show()
  }

  function toReply(id){
    store.dispatch({ type: commentActions.SET, data: { activeId: id } })
    props.navigation.push('reply', { signedName })
  }

  // 使用redux的数据源
  const state = props.comment.getActiveData()
  if(state.status === 1) return null
  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <StatusBar />
      <Header title={'评论：' + title} onTapAddComment={addComment} navigation={props.navigation} />
      <Editor getRef={refs.editor} pageId={state.pageId} onPosted={props.comment.incrementLoad} />
    
      <FlatList removeClippedSubviews data={state.tree.tree} 
        onEndReachedThreshold={1}
        onEndReached={loadList}
        initialNumToRender={4}
        style={{ flex: 1 }}
        renderItem={item => <Item 
          data={item.item}
          navigation={props.navigation}
          signedName={signedName}
          onDel={props.comment.del}
          onTapReply={toReply}
        />}

        ListHeaderComponent={state.data.popular.length !== 0 ? 
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginBottom: 10 }}>热门评论</Text>
            {state.data.popular.map(item =>
              <Item key={item.id} data={item} navigation={props.navigation} onDel={props.comment.del} visibleReply={false} visibleReplyBtn={false} />  
            )}
            <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginTop: 10 }}>全部评论</Text>
          </View>
        : null}

        ListFooterComponent={({
          0: () => 
          <TouchableOpacity onPress={loadList}>
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
              <Text>加载失败，点击重试</Text>
            </View>
          </TouchableOpacity>,

          2: () => <ActivityIndicator color={$colors.main} size={50} style={{ marginVertical: 10 }} />,
          4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>已经没有啦</Text>,
          5: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>还没有评论哦</Text>
        }[state.status] || new Function)()}
        textBreakStrategy="balanced"
      />
    </View>
  )
}

export default commentHOC(Comment)

const styles = StyleSheet.create({
  
})