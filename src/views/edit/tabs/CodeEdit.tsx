import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import editApi from '~/api/edit'
import ArticleEditor, { ArticleEditorRef } from '~/components/articleEditor'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import tabDataCommunicator from '../utils/tabDataCommunicator'
import i from '../lang'

export interface RouteParams {
  title: string
  section?: number
  isCreate?: boolean
}

export interface Props {

}

function EditCodeTab(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const [status, setStatus] = useState(1)
  const [content, setContent] = useState<string | null>(null)
  const [visibleSectionTitleInput, setVisibleSectionTitleInput] = useState(false)
  const originalContentSample = useRef('')
  const refs = {
    articleEditor: useRef<ArticleEditorRef>()
  }

  useEffect(() => {
    const { isCreate, newSection } = tabDataCommunicator.data

    if (isCreate || newSection) {
      setStatus(3)
      setContent('')
      originalContentSample.current = ''

      if (newSection) {
        setVisibleSectionTitleInput(true)
        setContent(`== ${i.codeEdit.newSectionDefaultTitle} ==`)
        changeText(`== ${i.codeEdit.newSectionDefaultTitle} ==`)

        const injectedScriptStr = (() => {
          const editArea: any = document.querySelector('#editArea')
          editArea.focus()
          editArea.selectionStart = 3
          editArea.selectionEnd = 8
        }).toString()

        setTimeout(() => {
          refs.articleEditor.current!.injectScript(`(${injectedScriptStr})()`)
        }, 300)
      }
    } else {
      loadCode() 
    }
  }, [])

  function loadCode () {
    setStatus(2)
    const { title, section } = tabDataCommunicator.data
    editApi.getCode(title, section).then(data => {
      let wikitext = data.parse.wikitext['*'] || ''
      setStatus(3)
      setContent(wikitext)
      tabDataCommunicator.data.content = wikitext
      tabDataCommunicator.data.contentReady.resolve(wikitext)
      originalContentSample.current = wikitext
    }).catch(e => {
      console.log(e)
      setStatus(0)
      navigation.setParams({ status: 0 })
    })
  }

  function changeText(text: string) {
    setContent(text)
    tabDataCommunicator.data.content = text
    tabDataCommunicator.data.needUpdate = true
    tabDataCommunicator.data.isContentChanged = originalContentSample.current !== text
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
          <TouchableOpacity onPress={loadCode}>
            <Text style={{ fontSize: 16, color: theme.colors.accent }}>{i.codeEdit.reload}</Text>
          </TouchableOpacity>,
        1: () => null, 
        2: () => <ActivityIndicator color={theme.colors.accent} size={50} />,
        3: () => <ArticleEditor getRef={refs.articleEditor} content={content} onChangeText={changeText} />
      } as { [status: number]: () => JSX.Element | null })[status]()}
    </View>
  )
}

export default EditCodeTab