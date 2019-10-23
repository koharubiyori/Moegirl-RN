import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getRecentChanges } from '~/api/query'

export default class FindsModuleTrend extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      data: null
    }

    this.getRecentChanges()
  }

  getRecentChanges = () =>{
    getRecentChanges().then(data =>{
      console.log(data)
      data = data.query.recentchanges

      var total = {}   // 保存总数统计
      data.map(item => item.title).forEach(title =>{
        if(total[title]){
          total[title]++
        }else{
          total[title] = 1
        }
      })

      var result = Object.keys(total).map(title => ({ title, total: total[title] })).sort((x, y) => x.total < y.total ? 1 : -1)
      this.setState({ data: result })
    })
  }
  

  render (){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcon name="flash-circle" color={$colors.sub} size={26} />
          <Text style={{ marginLeft: 10 }}>趋势</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 3
  },

  header: {
    height: 50,
    paddingHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  }
})