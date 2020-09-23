import { useFocusEffect } from '@react-navigation/native'
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import editApi from '~/api/edit'
import ArticleView from '~/components/articleView'
import i from '../lang'
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
            <Text style={{ fontSize: 16, color: theme.colors.accent }}>{i.preview.reload}</Text>
          </TouchableOpacity>,
        1: () => null,
        2: () => <ActivityIndicator color={theme.colors.accent} size={50} />,
        3: () => 
          <ArticleView disabledLink 
            style={{ 
              flex: 1,
              width: Dimensions.get('window').width 
            }} 
            html={html}
            injectedStyles={['body { user-select: initial; }']}
          />
      } as { [status: number]: () => JSX.Element | null })[status]()}
    </View>
  )
}

export default EditPreviewTab