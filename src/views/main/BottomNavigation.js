import React from 'react'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import { BottomNavigation } from 'react-native-material-ui'

export default class MyBottomNavigation extends React.Component{
  constructor (props){
    super(props)
    this.state = {
      active: 'index'
    }

    this.itemStyle = {
      container: {},
      active: { color: $colors.main },
      disabled: {}
    }
  }
  
  render (){
    return (
      <BottomNavigation active={this.state.active}>
        <BottomNavigation.Action
          key="index"
          icon="book"
          label="首页"
          onPress={() => this.setState({ active: 'index' })}
          style={this.itemStyle}
        />        
        <BottomNavigation.Action
          key="finds"
          icon="stars"
          label="发现"
          onPress={() => this.setState({ active: 'finds' })}
        />        
        <BottomNavigation.Action
          key="history"
          icon="history"
          label="历史"
          onPress={() => this.setState({ active: 'history' })}
        />        
      </BottomNavigation>
    )
  }
}

const styles = StyleSheet.create({
  active: {
    color: $colors.main
  }
})