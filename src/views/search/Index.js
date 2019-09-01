import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import StatusBar from '@/components/StatusBar'
import Header from './Header'

const NavigationContext = React.createContext()

export { NavigationContext }

export default class Search extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }
  

  render (){
    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar blackText color="white" />
          <Header></Header>
        </View>
      </NavigationContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  
})