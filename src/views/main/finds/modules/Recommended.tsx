import React, { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { getMainImage } from '~/api/article'
import { getRandomPages } from '~/api/query'
import { getHint } from '~/api/search'
import storage from '~/utils/storage'
import ArticleGroup from './components/ArticleGroup'

const random = (max = 1, min = 0) => Math.floor((Math.random() * max - min) + min)

export interface Props {
  navigation: __Navigation.Navigation
  style?: StyleProp<ViewStyle>
  getRef: MutableRefObject<any>
}

export interface FindsModuleRecommendedRef {
  reload (): void
}

type FinalProps = Props

function FindsModuleRecommended(props: PropsWithChildren<FinalProps>) {
  const [data, setData] = useState([])
  const [status, setStatus] = useState(2)
  const [searchTitle, setSearchTitle] = useState('')

  if (props.getRef) props.getRef.current = { reload }

  useEffect(() => {
    getArticleCaches()
  }, [])

  function reload() {
    return getArticleCaches()
  }

  function getArticleCaches () {
    setStatus(2)
    return new Promise(async (resolve, reject) => {
      try {
        let cache = await storage.get('articleCache')
  
        if (cache) {
          // 拿到缓存中所有标题
          let data = Object.values(cache).map(item => item.parse.title)
          if (data.length <= 5) {
            var lastPages = data
          } else {
            // 抽出最后五个
            var lastPages = [data.pop(), data.pop(), data.pop(), data.pop(), data.pop()]
          }
    
          // 随机抽出一个，执行搜索
          let title = lastPages[random(lastPages.length)]
          setSearchTitle(title)
          let searchedPages = await getHint(title, 11)
          searchedPages = searchedPages.query.search.map(item => item.title).filter(item => item != title)
  
          if (searchedPages.length > 5) {
            var results = []
            
            // 从搜索结果中随机抽出5个
            while (results.length < 5) {
              let ran = searchedPages[random(searchedPages.length)]
              !results.includes(ran) && results.push(ran)
            }
          } else {
            var results = searchedPages
          }
        } else {
          // 没有缓存，执行完全随机
          let randomPages = await getRandomPages()
          var results = randomPages.query.random.map(item => item.title)
        }
  
        // 排除首页
        results = results.filter(title => title !== 'Mainpage')
  
        // 为随机结果添加配图
        let images = await Promise.all(results.map(title => getMainImage(title)))
        results = results.map((title, index) => ({ title, image: images[index] ? images[index].source : null }))
  
        setData(results)
        setStatus(results.length === 0 ? 4 : 3)
        resolve()
      } catch (e) {
        console.log(e)
        setStatus(0)
        reject()
      }
    })
  }

  return (
    <ArticleGroup
      title="推荐"
      subtitle={searchTitle && (status === 3 || status === 4) ? `因为您阅读了“${searchTitle}”` : undefined}
      icon={<MaterialCommunityIcons name="star-box" color={$colors.sub} size={26} />}
      articles={data}
      navigation={props.navigation}
      status={status}
      onTapReload={reload}
    />
  )
}

export default FindsModuleRecommended