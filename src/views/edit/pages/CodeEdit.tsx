import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import editApi from '~/api/edit'
import ArticleEditor from '~/components/articleEditor'

export interface Props {

}

export interface ScreenProps {
  title: string
  section: number
  isCreate?: boolean
}

type FinalProps = Props & __Navigation.InjectedNavigation

function CodeEdit(props: PropsWithChildren<FinalProps>) {
  const [status, setStatus] = useState(1)
  const [content, setContent] = useState<string | null>(null)
  const initContentSample = useRef('')

  useEffect(() => {
    const { isCreate } = props.navigation.getScreenProps<ScreenProps>()

    if (isCreate) {
      setStatus(3)
      setContent('')
      props.navigation.setParams({ loadStatus: 3, content: '' })
      initContentSample.current = ''
    } else {
      loadCode()
    }
    
  }, [])

  function loadCode () {
    setStatus(2)
    const { title, section } = props.navigation.getScreenProps<ScreenProps>()
    editApi.getCode(title, section).then(data => {
      let wikitext = data.parse.wikitext['*'] || ''
      setStatus(3)
      setContent(wikitext)
      props.navigation.setParams({ loadStatus: 3, content: wikitext })
      initContentSample.current = wikitext
    }).catch(e => {
      console.log(e)
      setStatus(0)
      props.navigation.setParams({ status: 0 })
    })
  }

  function changeText(text: string) {
    setContent(text)
    props.navigation.setParams({ content: text, isContentChanged: initContentSample.current !== text })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {({
        0: () => 
          <TouchableOpacity onPress={loadCode}>
            <Text style={{ fontSize: 16, color: $colors.main }}>重新加载</Text>
          </TouchableOpacity>,
        1: () => null, 
        2: () => <ActivityIndicator color={$colors.main} size={50} />,
        3: () => <ArticleEditor content={content} onChangeText={changeText} />
      } as { [status: number]: () => JSX.Element | null })[status]()}
    </View>
  )
}

export default CodeEdit