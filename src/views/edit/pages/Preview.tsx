import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Button } from 'react-native-material-ui'
import editApi from '~/api/edit'
import ArticleView from '~/components/articleView'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

function EditPreview(props: PropsWithChildren<FinalProps>) {
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
        0: () => <Button primary text="重新加载" onPress={() => parseCodes()}></Button>,
        1: () => null,
        2: () => <ActivityIndicator color={$colors.main} size={50} />,
        3: () => <ArticleView disabledLink style={{ flex: 1 }} html={html} injectStyle={['article']} navigation={props.navigation} />
      } as { [status: number]: () => JSX.Element | null })[status]()}
    </View>
  )
}

export default EditPreview