import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import Home from './Home'
import Finds from './finds/Index'
import History from './History'
import BottomNavigation from './BottomNavigation'

const NavigationContext = React.createContext()

Index.propTypes = {
  navigation: PropTypes.object
}

export default function Index(props){
  return (
    <NavigationContext.Provider value={props.navigation}>
      <View style={{ flex: 1 }}>
        <Home style={{ flex: 1 }} />
        <BottomNavigation />
      </View>
    </NavigationContext.Provider>
  )
}