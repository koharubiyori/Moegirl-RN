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
      status: 1
    }
  }

  componentDidMount (){

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
  

  render (){
    return (
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        <StatusBar />
        <Header title={this.state.title} onTapAddComment={new Function} navigation={this.props.navigation} />

        <FlatList data={this.state.tree.tree} 
          onEndReachedThreshold={0.5}
          onEndReached={this.loadList}
          style={{ flex: 1 }}
          renderItem={item => <Item 
            key={item.item.id}
            data={item.item}
          />}

          ListFooterComponent={({
            2: () => <ActivityIndicator color={$colors.main} size={50} style={{ marginVertical: 10 }} />,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20 }}>已经没有啦</Text>
          }[this.state.status] || new Function)()}
          textBreakStrategy="balanced"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})