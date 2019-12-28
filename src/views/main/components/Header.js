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
  return (
    <>
      <StatusBar />
      <Toolbar
        title={props.title}
        leftIcon="menu"
        rightIcon="search"
        onPressLeftIcon={() => $drawer.open()}
        onPressRightIcon={() => props.navigation.push('search')}
      />
    </>
  )
}

export default withNavigation(IndexHeader)