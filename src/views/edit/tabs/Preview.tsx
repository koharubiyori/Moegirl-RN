import { useFocusEffect } from '@react-navigation/native'
import React, { PropsWithChildren, useCallback, useState, useEffect } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import editApi from '~/api/edit'
import ArticleView from '~/components/articleView'
import store from '~/mobx'
import tabDataCommunicator from '../utils/tabDataCommunicator'

export interface Props {
  title: string
  content: string
}

function EditPreviewTab(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const [html, setHtml] = useState('')
  const [status, setStatus] = useState(1)

  useEffect(() => {
    tabDataCommunicator.data.contentReady.promise.then(parseCodes)
  }, [])

  useFocusEffect(useCallback(() => {
    if (tabDataCommunicator.data.needUpdate) {
      tabDataCommunicator.data.needUpdate = false
      parseCodes(tabDataCommunicator.data.content)
    }
  }, []))

  function parseCodes(argContent?: string) {
    setStatus(2)
    const { content, title } = tabDataCommunicator.data
    editApi.getPreview(argContent || content, title)
      .then(data => {
        setHtml(data.parse.text['*'])
        setStatus(3)
        console.log('3333')
      }).catch(e => {
        console.log(e)
        setStatus(0)
      })
  }

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.colors.background 
    }}>
      {({
        0: () => 
          <TouchableOpacity onPress={() => parseCodes()}>
            <Text style={{ fontSize: 16, color: theme.colors.accent }}>重新加载</Text>
          </TouchableOpacity>,
        1: () => null,
        2: () => <ActivityIndicator color={theme.colors.accent} size={50} />,
        3: () => 
          <ArticleView disabledLink 
            style={{ flex: 1 }} 
            html={html} 
            styles={[
              'article',
              ...(store.settings.theme === 'night' ? ['nightMode'] as any : [])
            ]} 
          />
      } as { [status: number]: () => JSX.Element | null })[status]()}
    </View>
  )
}

export default EditPreviewTab