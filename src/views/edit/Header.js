import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import { Toolbar } from 'react-native-material-ui'

EditHeader.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object
}

export default function EditHeader({
  title,
  navigation
}){
  return (
    <Toolbar 
      style={{
        container: { elevation: 0, borderBottomColor: 'white', borderBottomWidth: 1 },
        // titleText: { color: '#666' },
        // leftElement: { color: '#666' }
      }}
      leftElement="keyboard-backspace"
      centerElement={`编辑：${title}`}
      onLeftElementPress={() => navigation.goBack()}
    />
  )
}

const styles = StyleSheet.create({
  
})