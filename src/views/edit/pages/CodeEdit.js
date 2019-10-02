import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'

export default class CodeEdit extends React.Component{
  static propTypes = {
    value: PropTypes.string
  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }
  

  render (){
    return (
      <View>
        <Text>codes edit</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})