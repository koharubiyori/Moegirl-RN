import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ActivityIndicator, FlatList,
  StyleSheet
} from 'react-native'
import Tree from '~/utils/tree'
import StatusBar from '~/components/StatusBar'
import Header from './Header'

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
      title: props.navigation.getParam('title')
    }
  }
  

  render (){
    return (
      <View>
        <StatusBar />
        <Header title={this.state.title} onTapAddComment={new Function} navigation={this.props.navigation} />

        <FlatList data={this.state.list} 
          onEndReachedThreshold={0.5}
          onEndReached={this.loadList}
          style={{ flex: 1 }}
          // renderItem={}
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