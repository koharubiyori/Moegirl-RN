import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import Toolbar from '~/components/Toolbar'

EditHeader.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object,
  onTapDoneBtn: PropTypes.func
}

export default function EditHeader(props){
  return (
    <Toolbar
      style={{
        elevation: 0, 
        borderBottomColor: 'white', 
        borderBottomWidth: 1
      }}

      title={`编辑：${props.title}`}
      leftIcon="keyboard-backspace"
      rightIcon="done"
      onPressLeftIcon={props.navigation.goBack}
      onPressRightIcon={props.onTapDoneBtn}
    />
  )
}

const styles = StyleSheet.create({
  
})