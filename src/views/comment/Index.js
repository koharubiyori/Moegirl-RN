import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ActivityIndicator, FlatList,
  StyleSheet
} from 'react-native'
import Tree from '~/utils/tree'
import toast from '~/utils/toast'
import StatusBar from '~/components/StatusBar'
import commentHOC from '~/redux/comment/HOC'
import * as commentActions from '~/redux/comment/actionTypes'
import store from '~/redux'
import Header from './Header'
import Editor from './Editor'
import Item from './components/Item'

class Comment extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)

    var data = props.navigation.getParam('firstData')
    var tree = new Tree(props.navigation.getParam('firstData').posts)
    var status = tree.tree.length >= data.count ? 4 : 1
    if(data.count === 0) status = 5

    store.dispatch({
      type: commentActions.SET,
      data: {
        data, tree, status,
        pageId: props.navigation.getParam('id'),
        title: props.navigation.getParam('title'),
        activeId: ''
      }
    })

    this.pageId = props.navigation.getParam('id')
  }

  loadList = () =>{
    this.props.comment.load(this.pageId).catch(() => toast.show('加载失败，正在重试'))
  }

  // setReplyRouteParams = params =>{
  //   var parentRoute = this.props.navigation.dangerouslyGetParent()
  //   var {routes} = parentRoute.state

  //   var lastRoute = routes[routes.length - 1]
  //   if(lastRoute.routeName === 'reply'){
  //     var replyRouteKey = lastRoute.key
  //     parentRoute._childrenNavigation[replyRouteKey].setParams(params)
  //   }
  // }

  toReply = id =>{
    store.dispatch({ type: commentActions.SET, data: { activeId: id } })
    // this.props.navigation.push('reply')
  }

  render (){
    // 使用redux的数据源
    const state = this.props.state.comment
    if(!state.data) return null

    return (
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        <StatusBar />
        <Header title={'评论：' + state.title} onTapAddComment={() => this.refs.editor.show()} navigation={this.props.navigation} />
        <Editor ref="editor" pageId={state.pageId} onPosted={this.props.comment.incrementLoad} />
      
        <FlatList data={state.tree.tree} 
          onEndReachedThreshold={0.5}
          onEndReached={this.loadList}
          style={{ flex: 1 }}
          renderItem={item => <Item 
            key={item.item.id}
            data={item.item}
            onDel={this.props.comment.del}
            onTapReply={this.toReply}
          />}

          ListHeaderComponent={state.data.popular.length !== 0 ? 
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginBottom: 10 }}>热门评论</Text>
              {state.data.popular.map(item =>
                <Item key={item.id} data={item} onDel={this.props.comment.del} visibleReply={false} visibleReplyBtn={false} />  
              )}
              <Text style={{ fontSize: 18, marginLeft: 20, color: '#666', marginTop: 10 }}>全部评论</Text>
            </View>
          : null}

          ListFooterComponent={({
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