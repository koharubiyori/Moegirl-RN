import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import Home from './Home'
import Finds from './Finds/Index'
import History from './History/Index'
import BottomNavigation from './BottomNavigation'

const NavigationContext = React.createContext()

export { NavigationContext }

export default class Index extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }
  
  constructor (props){
    super(props)

    this.state = {
      active: 'home',
    }
  }

  activeViewStyle (key){
    return {
      flex: this.state.active === key ? 1 : 0,
      height: this.state.active === key ? null : 0,
      overflow: this.state.active === key ? null : 'hidden'
    }
  }

  render (){

    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <View style={{ flex: 1 }}>
          <Home style={this.activeViewStyle('home')} />
          <Finds style={this.activeViewStyle('finds')} />
          <History style={this.activeViewStyle('history')} />
          <BottomNavigation active={this.state.active} onPress={key => this.setState({ active: key })} />
        </View>
      </NavigationContext.Provider>
    )
  }
}