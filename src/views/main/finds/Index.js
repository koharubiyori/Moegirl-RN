import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView, RefreshControl,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import Header from '../components/Header'
import { NavigationContext } from '~/views/main/Index'

import Trend from './modules/Trend'
import Recommended from './modules/Recommended'

export default class Finds extends React.Component{
  static propTypes = {
    style: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      visibleRefreshControl: false
    }

    this._ref = {
      trend: React.createRef(),
      recommended: React.createRef()
    }
  }

  reload = () =>{
    this.setState({ visibleRefreshControl: true })

    Promise.all(
      Object.values(this._ref).map(mod => mod.current.reload())
    ).finally(() =>{
      console.log('loaded')
      this.setState({ visibleRefreshControl: false })
    })
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

          <ScrollView
            refreshControl={<RefreshControl colors={[$colors.main]} onRefresh={this.reload} refreshing={this.state.visibleRefreshControl} />}
          >
            {/* <Text style={{ marginVertical: 20, marginLeft: 20, fontSize: 16 }}>{this.dateStr()}</Text> */}
            <Trend navigation={navigation} ref={this._ref.trend} />
            <Recommended navigation={navigation} ref={this._ref.recommended} />
          </ScrollView>
        </View>
      }</NavigationContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({
  
})