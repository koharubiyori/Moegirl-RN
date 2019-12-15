import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TextInput, ActivityIndicator,
  StyleSheet
} from 'react-native'
import Button from '~/components/Button'
import ArticleEditor from '~/components/articleEditor/Index'
import { getCode } from '~/api/edit'

function CodeEdit(props){
  const [status, setStatus] = useState(1)
  const [content, setContent] = useState('')
  const initContentSample = useRef('')

  useEffect(() =>{
    loadCode()
  }, [])

  function loadCode (){
    setStatus(2)
    const {title, section} = props.navigation.getScreenProps()
    getCode(title, section).then(data =>{
      let wikitext = data.parse.wikitext['*'] || ' '
      setStatus(3)
      setContent(wikitext)
      props.navigation.setParams({ loadStatus: 3, content: wikitext })
      initContentSample.current = wikitext
    }).catch(e =>{
      console.log(e)
      setStatus(0)
      props.navigation.setParams({ status: 0 })
    })
  }

  function changeText(text){
    setContent(text)
    props.navigation.setParams({ content: text, isContentChanged: initContentSample.current !== text })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {{
        0: () => <Button primary text="重新加载" onPress={loadCode}></Button>,
        1: () => null, 
        2: () => <ActivityIndicator color={$colors.main} size={50} />,
        3: () => <ArticleEditor content={content} onChangeText={changeText} />
      }[status]()}
    </View>
  )
}

export default CodeEdit