import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import editApi from '~/api/edit'
import ArticleView from '~/components/articleView'
import { useTheme } from 'react-native-paper'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

function EditPreview(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [html, setHtml] = useState('')
  const [status, setStatus] = useState(1)

  useEffect(() => {
    props.navigation.setParams({ refresh: parseCodes })
  }, [])

  function parseCodes(argContent?: string) {
    setStatus(2)
    const { content, title } = props.navigation.getScreenProps()
    editApi.getPreview(argContent || content, title).then(data => {
      setHtml(data.parse.text['*'])
      setStatus(3)
    }).catch(e => {
      console.log(e)
      setStatus(0)
    })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {({
        0: () => 
          <TouchableOpacity onPress={() => parseCodes()}>
            <Text style={{ fontSize: 16, color: theme.colors.primary }}>重新加载</Text>
          </TouchableOpacity>,
        1: () => null,
        2: () => <ActivityIndicator color={theme.colors.accent} size={50} />,
        3: () => <ArticleView disabledLink style={{ flex: 1 }} html={html} injectStyle={['article']} navigation={props.navigation} />
      } as { [status: number]: () => JSX.Element | null })[status]()}
    </View>
  )
}

export default EditPreview