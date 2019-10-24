import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, 
  StyleSheet
} from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ArticleGroup from './components/ArticleGroup'
import storage from '~/utils/storage'

export default class FindsModuleTrend extends React.Component{
  static propTypes = {
    navigation: PropTypes.object,
    style: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      data: [],
      status: 1
    }

    this.getArticleCaches()
  }

  getArticleCaches = () =>{
    storage.get('articleCache').then(data =>{
      console.log(data)
      // 最後で見た3ページをランダムに抽出して、そのページのカテゴリもランダムに出してから、カテゴリの下の条目を5つに読み込む
    })
  }

  render (){
    return (
      // <ArticleGroup style={{ marginTop: 0 }}
      //   title="趋势"
      //   icon={<MaterialCommunityIcon name="flash-circle" color={$colors.sub} size={26} />}
      //   articles={this.state.data}
      //   navigation={this.props.navigation}
      // />

      null
    )
  }
}

const styles = StyleSheet.create({

})