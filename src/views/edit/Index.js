import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet, 
} from 'react-native'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import StatusBar from '~/components/StatusBar'
import Header from './Header'
import TabNavigator from './TabNavigator'

export default class Edit extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }

  render (){
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar />
        <Header title={this.props.navigation.getParam('title')} navigation={this.props.navigation} />
        <AndroidBackHandler onBackPress={() => this.props.navigation.goBack()} >
          <TabNavigator />
        </AndroidBackHandler>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})