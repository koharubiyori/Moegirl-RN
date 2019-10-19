import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ActivityIndicator, FlatList,
  StyleSheet
} from 'react-native'
import Tree from '~/utils/tree'
import toast from '~/utils/toast'
import StatusBar from '~/components/StatusBar'
import { getComments } from '~/api/comment'
import Header from './Header'
import Editor from './Editor'
import Item from './components/Item'

export default class Comment extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      data: props.navigation.getParam('firstData'),
      tree: new Tree(props.navigation.getParam('firstData').posts),
      id: props.navigation.getParam('id'),
      title: props.navigation.getParam('title'),
      status: 1,

      editorPostId: '',
      editorIsReply: false 
    }
  }

  componentDidMount (){
    console.log(this.state.data)
  }

  loadList = () =>{
    if(this.state.status === 4 || this.state.status === 2){ return }
    this.setState({ status: 2 })
    getComments(this.state.id, this.state.tree.tree.length)
      .then(data =>{
        if(data.count === 0){
          this.setState({ status: 5 })
          return
        }

        var status = 3
        var tree = new Tree(data.posts)

        if(data.count <= this.state.tree.tree.length + tree.tree.length){
          status = 4
        }

        data.posts = this.state.data.posts.concat(data.posts)
        this.setState({ data, status, tree: new Tree(data.posts) })

      }).catch(e =>{
        console.log(e)
        this.setState({ status: 0 })
        toast.show('加载失败，正在重试')
      })
  }

  incrementLoad = () =>{
    getComments(this.state.id).then(({posts, count}) =>{
      var currentPostIds = this.state.data.posts.map(item => item.id)
      var newComments = posts.filter(item => !currentPostIds.includes(item.id))

      var newPosts = [ ...newComments, ...this.state.data.posts ]
      this.setState({
        data: { ...this.state.data, posts: newPosts, count },
        tree: new Tree(newPosts)
      })
    })
  }

  delCommentData = id =>{
    var newPosts = this.state.data.posts.filter(item => item.id !== id)
    this.setState({
      data: { ...this.state.data, posts: newPosts },
      tree: new Tree(newPosts)
    })
  }

  render (){
    return (
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        <StatusBar />
        <Header title={this.state.title} onTapAddComment={() => this.refs.editor.show()} navigation={this.props.navigation} />
        <Editor ref="editor" 
          targetId={this.state.editorIsReply ? this.state.editorPostId : this.state.id} 
          isReply={this.state.editorIsReply} 
          onPosted={this.incrementLoad}
         />
      
        <FlatList data={this.state.tree.tree} 
          onEndReachedThreshold={0.5}
          onEndReached={this.loadList}
          style={{ flex: 1 }}
          renderItem={item => <Item 
            key={item.item.id}
            data={item.item}
            onDel={this.delCommentData}
          />}

          ListHeaderComponent={this.state.data.popular.length !== 0 ? 
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginBottom: 10 }}>热门评论</Text>
              {this.state.data.popular.map(item =>
                <Item key={item.id} data={item} onDel={this.delCommentData} visibleReply={false} visibleReplyBtn={false} />  
              )}
              <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginTop: 10 }}>全部评论</Text>
            </View>
          : null}

          ListFooterComponent={({
            2: () => <ActivityIndicator color={$colors.main} size={50} style={{ marginVertical: 10 }} />,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>已经没有啦</Text>
          }[this.state.status] || new Function)()}
          textBreakStrategy="balanced"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})