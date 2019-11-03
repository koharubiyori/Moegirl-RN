import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, DeviceEventEmitter,
  StyleSheet
} from 'react-native'
import { BottomNavigation } from 'react-native-material-ui'

export default class MyBottomNavigation extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)

    this.state = {
      active: 'home'
    }
  }

  selectTab = key =>{
    this.setState({ active: key })
    this.props.jumpTo(key)
  }
  
  render (){
    return (
      <BottomNavigation active={this.state.active}>
        <BottomNavigation.Action
          key="home"
          icon="book"
          label="首页"
          onPress={() => this.selectTab('home')}
        />        
        <BottomNavigation.Action
          key="finds"
          icon="stars"
          label="发现"
          onPress={() => this.selectTab('finds')}
        />        
        <BottomNavigation.Action
          key="history"
          icon="history"
          label="历史"
          onPress={() => this.selectTab('history')}
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