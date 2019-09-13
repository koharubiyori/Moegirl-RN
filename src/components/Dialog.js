import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import Dialog from 'react-native-dialog'

export default class Alert extends React.Component{
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
        <Dialog.Container visible>
          <Dialog.Title>Account delete</Dialog.Title>
          <Dialog.Description>
            Do you want to delete this account? You cannot undo this action.
          </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={new Function} />
          <Dialog.Button label="Delete" onPress={new Function} />
        </Dialog.Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})