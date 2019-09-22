import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image,
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
      <View>
        <View style={{ height: NativeModules.StatusBarManager.HEIGHT }} />
        <View style={styles.header}>
          <Image source={require('~/assets/images/akari.jpg')} style={{ width: 70, height: 70 }} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})