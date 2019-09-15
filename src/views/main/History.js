import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import storage from '~/utils/storage'
import StatusBar from '~/components/StatusBar'
import Header from './components/Header'

export default class Finds extends React.Component{
  static propTypes = {
    style: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      list: null,
      status: 1
    }
  }

  async componentWillMount (){
    var list = await storage.get('browsingHistory')
    this.setState({ list })
  }
  

  render (){
    return (
      <View style={{ ...this.props.style }}>
        <StatusBar />
        <Header title="浏览历史" />
        <View style={{ height: 30, backgroundColor: 'red' }}>
          <Text>History</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})