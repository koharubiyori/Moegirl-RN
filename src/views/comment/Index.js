import React from 'react'
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

class Comment extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)

    this.title = props.navigation.getParam('title')
    this.pageId = props.navigation.getParam('id')
  }
  
  componentWillUpdate (){
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
    )
  }

  loadList = () =>{
    InteractionManager.runAfterInteractions(() =>{
      this.props.comment.load().catch(() => toast.show('加载失败，正在重试'))
    })
  }

  addComment = () =>{
    var state = store.getState()
    if(!state.user.name){
      return $dialog.confirm.show({
        content: '需要先登录才能发表评论，是否前往登录界面？',
        onTapCheck: () => this.props.navigation.push('login')
      })
    }

    this.refs.editor.show()
  }

  toReply = id =>{
    store.dispatch({ type: commentActions.SET, data: { activeId: id } })
    this.props.navigation.push('reply')
  }

  render (){
    // 使用redux的数据源
    const state = this.props.comment.getActiveData()
    if(state.status === 1) return null

    return (
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        <StatusBar />
        <Header title={'评论：' + this.title} onTapAddComment={this.addComment} navigation={this.props.navigation} />
        <Editor ref="editor" pageId={state.pageId} onPosted={this.props.comment.incrementLoad} />
      
        <FlatList data={state.tree.tree} 
          onEndReachedThreshold={0.5}
          onEndReached={this.loadList}
          style={{ flex: 1 }}
          renderItem={item => <Item 
            key={item.item.id}
            data={item.item}
            navigation={this.props.navigation}
            onDel={this.props.comment.del}
            onTapReply={this.toReply}
          />}

          ListHeaderComponent={state.data.popular.length !== 0 ? 
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginBottom: 10 }}>热门评论</Text>
              {state.data.popular.map(item =>
                <Item key={item.id} data={item} navigation={this.props.navigation} onDel={this.props.comment.del} visibleReply={false} visibleReplyBtn={false} />  
              )}
              <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginTop: 10 }}>全部评论</Text>
            </View>
          : null}

          ListFooterComponent={({
            0: () => 
            <TouchableOpacity onPress={this.loadList}>
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
}

export default commentHOC(Comment)

const styles = StyleSheet.create({
  
})