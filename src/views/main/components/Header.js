import React from 'react'
import {
  View, Text,
  StyleSheet, 
} from 'react-native'
import PropTypes from 'prop-types'
import { Toolbar } from 'react-native-material-ui'
import { withNavigation } from 'react-navigation'
import StatusBar from '~/components/StatusBar'

class IndexHeader extends React.Component{
  static propTypes = {
    title: PropTypes.string.isRequired 
  }

  constructor (props){
    super(props)
    this.state = {
      showToast: false
    }
  }
  
  eventHandlers = event =>{
    if(event.action === 'search'){
      this.props.navigation.push('search')
    }
  }

  render (){
    return (
      <>
        <StatusBar />
        <Toolbar size={26}
          leftElement="menu"
          centerElement={this.props.title}
          rightElement={{
            actions: ['search'],
          }}

          onLeftElementPress={() => $drawer.open()}
          onRightElementPress={event =>{ this.eventHandlers(event) }}
        />
      </>
    )
  }
}

export default withNavigation(IndexHeader)

const styles = StyleSheet.create({

})