import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import commentHOC from '~/redux/comment/HOC'
import Item from './components/Item'
import Header from './Header'
import Editor from './Editor'
import format from './utils/format'
import store from '~/redux'

class CommentReply extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      replyId: ''
    }
  }

  addReply = (replyId = '') =>{
    var state = store.getState()
    if(!state.user.name){
      return $dialog.confirm.show({
        content: '需要先登录才能回复，是否前往登录界面？',
        onTapCheck: () => this.props.navigation.push('login')
      })
    }
    
    this.refs.editor.show()
    
    this.setState({ replyId }, this.refs.editor.show)
  }

  delCommentData = id =>{
    if(this.props.state.comment.activeId === id){ this.props.navigation.goBack() }
    this.props.comment.del(id)
  }
  
  render (){
    const state = this.props.state.comment

    const activeComment = state.tree.tree.filter(item => item.id === state.activeId)[0]
    const children = format.children(activeComment.children, state.activeId)

    return (
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        <StatusBar />
        <Header title={'回复：' + activeComment.username} onTapAddComment={this.addReply} navigation={this.props.navigation} />
        <Editor ref="editor"
          pageId={state.pageId}
          targetId={this.state.replyId || state.activeId}  
          onPosted={this.props.comment.incrementLoad}
         />
      
        <ScrollView style={{ flex: 1 }}>
          <View>
            <Item data={activeComment} onDel={this.delCommentData} visibleReply={false} visibleReplyBtn={false} visibleDelBtn={false} />
            {children.length !== 0 ? <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginVertical: 10 }}>回复</Text> : null}
          </View>
          
          {children.map(item => <Item visibleReply={false} visibleReplyNum={false}
            key={item.id}
            data={item}
            onDel={this.delCommentData}
            onTapReply={() => this.addReply(item.id)}
          />)}

            <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>
              {children.length === 0 ? '还没有回复哦' : '已经没有啦'}
            </Text>
        </ScrollView>
      </View>
    )
  }
}

export default commentHOC(CommentReply)

const styles = StyleSheet.create({
  
})