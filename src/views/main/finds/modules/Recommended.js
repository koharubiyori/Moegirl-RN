import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, 
  StyleSheet
} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import ArticleGroup from './components/ArticleGroup'
import storage from '~/utils/storage'
import { getHint } from '~/api/search'
import { getMainImage } from '~/api/article'
import { getRandomPages } from '~/api/query'

var random = (max = 1, min = 0) => Math.floor((Math.random() * max - min) + min)

export default class FindsModuleTrend extends React.Component{
  static propTypes = {
    navigation: PropTypes.object,
    style: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      data: [],
      status: 2,
      searchTitle: ''
    }

    this.getArticleCaches()
  }

  reload = () =>{
    return this.getArticleCaches()
  }

  getArticleCaches = () =>{
    this.setState({ status: 2 })
    return new Promise(async (resolve, reject) =>{
      try{
        var cache = await storage.get('articleCache')
  
        if(cache){
          // 拿到缓存中所有标题
          var data = Object.values(cache).map(item => item.parse.title)
          if(data.length <= 5){
            var lastPages = data
          }else{
            // 抽出最后五个
            var lastPages = [data.pop(), data.pop(), data.pop(), data.pop(), data.pop()]
          }
    
          // 随机抽出一个，执行搜索
          var title = lastPages[random(lastPages.length)]
          this.setState({ searchTitle: title })
          var searchedPages = await getHint(title, 11)
          searchedPages = searchedPages.query.search.map(item => item.title).filter(item => item != title)
  
          if(searchedPages.length > 5){
            var results = []
            
            // 从搜索结果中随机抽出5个
            while(results.length < 5){
              var ran = searchedPages[random(searchedPages.length)]
              !results.includes(ran) && results.push(ran)
            }
          }else{
            var results = searchedPages
          }
        }else{
          // 没有缓存，执行完全随机
          var randomPages = await getRandomPages()
          var results = randomPages.query.random.map(item => item.title)
        }
  
        // 排除首页
        results = results.filter(title => title !== 'Mainpage')
  
        // 为随机结果添加配图
        var images = await Promise.all(results.map(title => getMainImage(title)))
        results = results.map((title, index) => ({ title, image: images[index] ? images[index].source : null }))
  
        this.setState({ data: results, status: 3 })
        resolve()
      }catch(e){
        console.log(e)
        this.setState({ status: 0 })
        reject()
      }
    })
  }

  render (){
    return (
      <ArticleGroup
        title="推荐"
        subtitle={this.state.searchTitle && this.state.status === 3 ? `因为您阅读了“${this.state.searchTitle}”` : null}
        icon={<MaterialIcon name="history" color={$colors.sub} size={26} />}
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