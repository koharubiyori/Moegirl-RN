import React, { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import articleApi from '~/api/article'
import queryApi from '~/api/query'
import ArticleGroup, { ArticleGroupArticle } from './components/ArticleGroup'
import { useTheme } from 'react-native-paper'

export interface Props {
  navigation: __Navigation.Navigation
  style?: StyleProp<ViewStyle>
  getRef: MutableRefObject<any>
}

export interface FindsModuleTrendRef {
  reload (): void
}

type FinalProps = Props

function FindsModuleTrend(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [data, setData] = useState<ArticleGroupArticle[]>([])
  const [status, setStatus] = useState(2)
  
  if (props.getRef) props.getRef.current = { reload }

  useEffect(() => {
    getRecentChangesData()
  }, [])

  function reload() {
    return getRecentChangesData()
  }

  function getRecentChangesData() {
    setStatus(2)
    return new Promise((resolve, reject) => {
      queryApi.getRecentChanges()
        .then(data => {
          let changes = data.query.recentchanges
    
          let total: { [title: string]: number } = {} // 保存总数统计
          changes.map(item => item.title).forEach(title => {
            if (total[title]) {
              total[title]++
            } else {
              total[title] = 1
            }
          })
    
          let result = Object.keys(total).map(title => ({ title, total: total[title] })).sort((x, y) => x.total < y.total ? 1 : -1)
          return result.filter((_, index) => index < 5)  
        })    
        .then(data => {
          Promise.all(
            data.map(item => articleApi.getMainImage(item.title))
          ).then(images => {
            setStatus(3)
            // 为data添加image字段
            data.forEach((item, index) => (item as any).image = images[index] ? images[index].source : null)
            setData(data as any)
            resolve()
          }).catch(e => Promise.reject(e))
        })
        .catch(e => {
          console.log(e)
          setStatus(0)
          reject()
        })
    })
  }

  return (
    <ArticleGroup
      title="趋势"
      icon={<MaterialCommunityIcon name="flash-circle" color={theme.colors.accent} size={26} />}
      articles={data}
      navigation={props.navigation}
      status={status}
      onPressReload={reload}
    />
  )
}

export default FindsModuleTrend