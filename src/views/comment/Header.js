import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import { Toolbar } from 'react-native-material-ui'

CommentHeader.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object,
  onTapEdit: PropTypes.func
}

export default function CommentHeader({
  title,
  navigation,
  onTapAddComment
}){
  function eventHandlers(event){
    if(event.action === 'add_comment'){
      onTapAddComment()
    }
  }

  return (
    <Toolbar size={26}
      rightElement={{
        actions: ['insert-comment'],
      }}

      leftElement="keyboard-backspace"
      centerElement={`评论：${title}`}
      onLeftElementPress={() => navigation.goBack()}
      onRightElementPress={eventHandlers}
    />
  )
}

const styles = StyleSheet.create({
  
})