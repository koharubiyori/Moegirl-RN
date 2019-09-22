import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity,
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

  componentDidMount (){
    this.props.navigation.addListener('willBlur', e => console.log(e))
  }

  render (){
    return (
      <View>
        <View style={{ height: NativeModules.StatusBarManager.HEIGHT }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
            <Image source={require('~/assets/images/akari.jpg')} style={{ width: 70, height: 70 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})