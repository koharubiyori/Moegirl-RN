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

export default function EditHeader({
  title,
  navigation,
  onTapDoneBtn
}){
  function eventHandlers(event){
    if(event.action === 'done'){
      onTapDoneBtn()
    }
  }

  return (
    <Toolbar size={26}
      style={{
        container: { elevation: 0, borderBottomColor: 'white', borderBottomWidth: 1 },
      }}

      rightElement={{
        actions: ['done'],
      }}

      leftElement="keyboard-backspace"
      centerElement={`编辑：${title}`}
      onLeftElementPress={() => navigation.goBack()}
      onRightElementPress={eventHandlers}
    />
  )
}

const styles = StyleSheet.create({

})