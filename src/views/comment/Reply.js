import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, FlatList,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import Item from './components/Item'
import Header from './Header'
import Editor from './Editor'

export default class CommentReply extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      pageId: props.navigation.getParam('pageId'),
      data: props.navigation.getParam('data'),
      children: props.navigation.getParam('children'),
      indexInstance: props.navigation.getParam('indexInstance'),

      replyId: ''
    }
  }

  componentDidMount (){
    console.log(this.props.navigation.dangerouslyGetParent())
  }

  addReply = (replyId = '') =>{
    this.setState({ replyId })
    setTimeout(() => this.refs.editor.show())
  }

  incrementLoad = () =>{
    this.state.indexInstance.incrementLoad()
    this.forceUpdate()
  }

  delCommentData = id =>{
    if(this.state.data.id === id){ this.props.navigation.goBack() }
    this.state.indexInstance.delCommentData(id)
  }
  
  render (){
    return (
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        <StatusBar />
        <Header title={'回复：' + this.state.data.username} onTapAddComment={this.addReply} navigation={this.props.navigation} />
        <Editor ref="editor"
          pageId={this.state.pageId}
          targetId={this.state.replyId || this.state.data.id}  
          onPosted={this.incrementLoad}
         />
      
        <FlatList data={this.state.children} 
          onEndReachedThreshold={0.5}
          // onEndReached={this.loadList}
          textBreakStrategy="balanced"
          style={{ flex: 1 }}
          renderItem={item => <Item visibleReply={false} visibleReplyNum={false}
            key={item.item.id}
            data={item.item}
            onDel={this.delCommentData}
            onTapReply={() => this.addReply(item.item.id)}
          />}

          ListHeaderComponent={
            <View>
              <Item data={this.state.data} onDel={this.delCommentData} visibleReply={false} visibleReplyBtn={false} />
              {this.state.children.length !== 0 ? <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginVertical: 10 }}>回复</Text> : null}
            </View>
          }

          ListFooterComponent={
            <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>
              {this.state.children.length === 0 ? '还没有回复哦' : '已经没有啦'}
            </Text>
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})