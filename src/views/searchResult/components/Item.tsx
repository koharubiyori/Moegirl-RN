import React, { PropsWithChildren } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '~/components/Button'

export interface Props {
  data: any
  searchWord: string
  onPress (pageTitle: string): void
}

type FinalProps = Props

export default function SearchResultItem(props: PropsWithChildren<FinalProps>) {
  function contentFormat(content: string) {
    if (content.trim() === '') return null

    return content.split('<span class="searchmatch">').map((section, index) => {
      if (index === 0) return <Text>{section}</Text>
      
      var [strong, plain] = section.split('</span>')
      return <Text key={index}>
        <Text style={{ backgroundColor: '#93E478' }}>{strong}</Text>
        {plain ? <Text>{plain}</Text> : null}
      </Text>
    })
  }

  function subInfo() {
    var text = ''
    if (props.data.redirecttitle) {
      text = `「${props.data.redirecttitle}」指向该页面`
    } else if (props.data.sectiontitle) {
      text = `该页面有包含“${props.searchWord}”的章节`
    } else if (props.data.categoriesnippet) {
      text = `匹配自页面分类：${props.data.categoriesnippet}`
    }

    return <Text style={{ fontStyle: 'italic', color: $colors.light }}>{text}</Text>
  }

  const content = contentFormat(props.data.snippet)

  return (
    <Button contentContainerStyle={styles.container} noLimit={false} rippleColor={$colors.light}
      onPress={() => props.onPress(props.data.title)}
    >
      <View style={styles.title}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, flexShrink: 1 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >{props.data.title}</Text>
        {subInfo()}
      </View>

      <View style={styles.content}>
        <Text style={{ color: content ? 'black' : '#ABABAB' }}>{content || '页面内貌似没有内容呢...'}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={{ textAlign: 'right', color: '#666' }}>最后更新于：{props.data.timestamp.split('T')[0]}</Text>
      </View>
    </Button>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    elevation: 2,
  },

  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10
  },

  content: {
    paddingVertical: 5,
    marginTop: 5,
    borderTopColor: $colors.main,
    borderBottomColor: $colors.main,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },

  footer: {
    
  }
})