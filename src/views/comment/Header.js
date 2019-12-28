import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import Toolbar from '~/components/Toolbar'

CommentHeader.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object,
  onTapEdit: PropTypes.func
}

export default function CommentHeader(props){
  return (
    <Toolbar
      title={props.title}
      leftIcon="keyboard-backspace"
      rightIcon="add"
      onPressLeftIcon={props.navigation.goBack}
      onPressRightIcon={props.onTapAddComment}
    />
  )
}

const styles = StyleSheet.create({
  
})