import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet, NativeModules
} from 'react-native'

export default class MyDrawer extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }
  

  render (){
    return (
      <View style={{ backgroundColor: 'red' }}>
        <View style={{ height: NativeModules.StatusBarManager.HEIGHT }} />
        <View>
          
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})