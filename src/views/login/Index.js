import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'

export default class Login extends React.Component{
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
        <StatusBar blackText color="white" />
        <Text>login</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})