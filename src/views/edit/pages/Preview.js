import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ActivityIndicator,
  StyleSheet
} from 'react-native'
import ArticleView from '~/components/articleView/Index'
import { Button } from 'react-native-material-ui'
import { getPreview } from '~/api/edit'

function EditPreview(props){
  const [html, setHtml] = useState('')
  const [status, setStatus] = useState(1)

  useEffect(() =>{
    props.navigation.setParams({ refresh: parseCodes })
  }, [])

  function parseCodes(argContent){
    setStatus(2)
    const {content, title} = props.navigation.getScreenProps()
    getPreview(argContent || content, title).then(data =>{
      setHtml(data.parse.text['*'])
      setStatus(3)
    }).catch(e =>{
      console.log(e)
      setStatus(0)
    })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {{
        0: () => <Button primary text="重新加载" onPress={() => parseCodes()}></Button>,
        1: () => null,
        2: () => <ActivityIndicator color={$colors.main} size={50} />,
        3: () => <ArticleView disabledLink style={{ flex: 1 }} html={html} injectStyle={['page']} navigation={props.navigation} />
      }[status]()}
    </View>
  )
}

export default EditPreview