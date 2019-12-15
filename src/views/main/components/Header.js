import React from 'react'
import {
  View, Text,
  StyleSheet, 
} from 'react-native'
import PropTypes from 'prop-types'
import Toolbar from '~/components/Toolbar'
import { withNavigation } from 'react-navigation'
import StatusBar from '~/components/StatusBar'

IndexHeader.propTypes = {
  title: PropTypes.string.isRequired 
}

function IndexHeader(props, ref){
  function eventHandlers(event){
    if(event.action === 'search'){
      props.navigation.push('search')
    }
  }

  return (
    <>
      <StatusBar />
      <Toolbar size={26}
        leftElement="menu"
        centerElement={props.title}
        rightElement={{
          actions: ['search'],
        }}

        onLeftElementPress={() => $drawer.open()}
        onRightElementPress={event =>{ eventHandlers(event) }}
      />
    </>
  )
}

export default withNavigation(IndexHeader)