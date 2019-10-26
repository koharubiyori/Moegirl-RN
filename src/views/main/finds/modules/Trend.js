import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, 
  StyleSheet
} from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ArticleGroup from './components/ArticleGroup'
import { getRecentChanges } from '~/api/query'
import { getMainImage } from '~/api/article'

export default class FindsModuleTrend extends React.Component{
  static propTypes = {
    navigation: PropTypes.object,
    style: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      data: [],
      status: 2
    }

   
    this.getRecentChanges()
  }

  reload = () =>{
    return this.getRecentChanges()
  }

  getRecentChanges = () =>{
    this.setState({ status: 2 })
    return new Promise((resolve, reject) =>{
      getRecentChanges()
        .then(data =>{
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
          return result.filter((_, index) => index < 5)  
        })    
        .then(data =>{
          Promise.all(
            data.map(item => getMainImage(item.title))
          ).then(images =>{
            this.setState({ status: 3 })
            data.forEach((item, index) => item.image = images[index] ? images[index].source : null)
            console.log(data)
            this.setState({ data })
            resolve()
          }).catch(e => Promise.reject(e))
        })
        .catch(e =>{
          console.log(e)
          this.setState({ status: 0 })
          reject()
        })
    })

  }
  

  render (){

    return (
      <ArticleGroup
        title="趋势"
        icon={<MaterialCommunityIcon name="flash-circle" color={$colors.sub} size={26} />}
        articles={this.state.data}
        navigation={this.props.navigation}
        status={this.state.status}
        onTapReload={this.reload}
      />
    )
  }
}

const styles = StyleSheet.create({

})