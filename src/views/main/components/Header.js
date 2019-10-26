import React from 'react'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { Toolbar } from 'react-native-material-ui'
import { NavigationContext } from '../Index'

export default class IndexHeader extends React.Component{
  static propTypes = {
    title: PropTypes.string.isRequired 
  }

  constructor (props){
    super(props)
    this.state = {
      showToast: false
    }

  }
  
  eventHandlers = (event, navigation) =>{
    console.log(event)
    if(event.action === 'search'){
      navigation.push('search')
    }
  }

  render (){
    return (
      <NavigationContext.Consumer>{navigation =>
        <Toolbar size={26}
          leftElement="menu"
          centerElement={this.props.title}
          rightElement={{
            actions: ['search'],
          }}

          onLeftElementPress={() => $drawer.open()}
          onRightElementPress={event =>{ this.eventHandlers(event, navigation) }}
        />
      }</NavigationContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({
  // body: {
  //   ...$theme.mainBg,
  //   paddingHorizontal: 15,
  //   height: 55,
  //   elevation: 3,

  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center'
  // },
  
  // title: {
  //   color: 'white',
  //   fontSize: 18,
  //   marginLeft: 10,
  //   marginTop: 5
  // }
})