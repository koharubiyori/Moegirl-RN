import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import Header from '../components/Header'
import { NavigationContext } from '~/views/main/Index'

import Trend from './modules/Trend'

export default class Finds extends React.Component{
  static propTypes = {
    style: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }
  
  dateStr = () =>{
    var date = new Date()
    var week = '日一二三四五六'
    return `${date.getMonth() + 1}月${date.getDate()}日 星期${week[date.getDay()]}`
  }

  render (){
    return (
      <NavigationContext.Consumer>{navigation =>
        <View style={{ ...this.props.style, backgroundColor: '#eee' }}>
          <StatusBar />
          <Header title="发现" />

          <Text style={{ marginVertical: 20, marginLeft: 20, fontSize: 16 }}>{this.dateStr()}</Text>

          <Trend />
        </View>
      }</NavigationContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({
  
})