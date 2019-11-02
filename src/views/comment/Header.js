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

export default function CommentHeader({
  title,
  navigation,
  onTapAddComment
}){
  function eventHandlers(event){
    if(event.action === 'insert-comment'){
      onTapAddComment()
    }
  }

  return (
    <Toolbar size={26}
      rightElement={{
        actions: ['insert-comment'],
      }}

      leftElement="keyboard-backspace"
      centerElement={title}
      onLeftElementPress={() => navigation.goBack()}
      onRightElementPress={eventHandlers}
    />
  )
}

const styles = StyleSheet.create({

})