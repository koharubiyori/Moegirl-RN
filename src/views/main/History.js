import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'

export default class Finds extends React.Component{
  static propTypes = {
    style: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }
  

  render (){
    return (
      <View style={{ ...this.props.style }}>
        <StatusBar />
        <View style={{ height: 30, backgroundColor: 'red' }}>
          <Text>History</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})