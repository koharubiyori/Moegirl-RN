import React, { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import articleApi from '~/api/article'
import queryApi from '~/api/query'
import searchApi from '~/api/search'
import storage from '~/utils/storage'
import ArticleGroup from './components/ArticleGroup'
import { useTheme } from 'react-native-paper'

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
  const theme = useTheme()
  const [data, setData] = useState<{ title: string, image: string | null }[]>([])
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
        let cache = storage.get('articleCache')
        console.log(cache)
  
        if (cache) {
          // 拿到缓存中所有标题
          let data = Object.values(cache).map(item => item.parse.title)
            // 排除分类页面
            .filter(item => !(/^([Cc]ategory|分类):/.test(item)))
          if (data.length <= 5) {
            var lastPages = data
          } else {
            // 抽出最后五个
            var lastPages = [data.pop()!, data.pop()!, data.pop()!, data.pop()!, data.pop()!]
          }
    
          // 随机抽出一个，执行搜索
          let title = lastPages[random(lastPages.length)]
          setSearchTitle(title)
          let searchedPages = await searchApi.getHint(title, 11)
          let searchedTitle = searchedPages.query.search.map(item => item.title).filter(item => item !== title)
  
          if (searchedTitle.length > 5) {
            var results: string[] = []
            
            // 从搜索结果中随机抽出5个
            while (results.length < 5) {
              let ran = searchedTitle[random(searchedTitle.length)]
              !results.includes(ran) && results.push(ran)
            }
          } else {
            var results = searchedTitle
          }
        } else {
          // 没有缓存，执行完全随机
          let randomPages = await queryApi.getRandomPages()
          var results = randomPages.query.random.map(item => item.title)
        }
  
        // 排除首页
        results = results.filter(title => title !== 'Mainpage')
  
        // 为随机结果添加配图
        let images = await Promise.all(results.map(title => articleApi.getMainImage(title)))
        let finalResult = results.map((title, index) => ({ title, image: images[index] ? images[index].source : null }))
  
        setData(finalResult)
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
      icon={<MaterialCommunityIcons name="star-box" color={theme.colors.accent} size={26} />}
      articles={data}
      navigation={props.navigation}
      status={status}
      onPressReload={reload}
    />
  )
}

export default FindsModuleRecommended