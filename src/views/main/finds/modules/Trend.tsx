import React, { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getMainImage } from '~/api/article'
import { getRecentChanges } from '~/api/query'
import ArticleGroup from './components/ArticleGroup'

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
  const [data, setData] = useState([])
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
      getRecentChanges()
        .then(data => {
          data = data.query.recentchanges
    
          let total = {} // 保存总数统计
          data.map(item => item.title).forEach(title => {
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
            data.map(item => getMainImage(item.title))
          ).then(images => {
            setStatus(3)
            data.forEach((item, index) => item.image = images[index] ? images[index].source : null)
            setData(data)
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
      icon={<MaterialCommunityIcon name="flash-circle" color={$colors.sub} size={26} />}
      articles={data}
      navigation={props.navigation}
      status={status}
      onTapReload={reload}
    />
  )
}

export default FindsModuleTrend