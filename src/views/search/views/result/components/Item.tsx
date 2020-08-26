import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import MyButton from '~/components/MyButton'
import { useTheme, Text } from 'react-native-paper'
import moment from 'moment'
import i from '../lang'

export interface Props {
  data: any
  searchWord: string
  onPress (pageTitle: string): void
}

type FinalProps = Props

export default function SearchResultItem(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  function contentFormat(content: string) {
    if (content.trim() === '') return null

    return content.split('<span class="searchmatch">').map((section, index) => {
      if (index === 0) return <Text key={index}>{section}</Text>
      
      var [strong, plain] = section.split('</span>')
      return <Text key={index}>
        <Text style={{ backgroundColor: theme.colors.light }}>{strong}</Text>
        {plain ? <Text>{plain}</Text> : null}
      </Text>
    })
  }

  function subInfo() {
    var text = ''
    if (props.data.redirecttitle) {
      text = i.item.subInfo.redirect(props.data.redirecttitle)
    } else if (props.data.sectiontitle) {
      text = i.item.subInfo.sectionTitle(props.searchWord)
    } else if (props.data.categoriesnippet) {
      text = i.item.subInfo.category(props.data.categoriesnippet)
    }

    return <Text style={{ fontStyle: 'italic', color: theme.colors.accent }}>{text}</Text>
  }

  const content = contentFormat(props.data.snippet)

  return (
    <MyButton contentContainerStyle={{ ...styles.container, backgroundColor: theme.colors.surface }} rippleColor={theme.colors.accent}
      onPress={() => props.onPress(props.data.title)}
    >
      <View style={styles.title}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, flexShrink: 1 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >{props.data.title}</Text>
        {subInfo()}
      </View>

      <View style={{ ...styles.content, borderColor: theme.colors.accent }}>
        <Text style={{ color: content ? 'black' : theme.colors.disabled }}>{content || i.item.noData}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={{ textAlign: 'right', color: theme.colors.disabled }}>{i.item.updateDate(moment(props.data.timestamp))}</Text>
      </View>
    </MyButton>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginTop: 10,
    marginHorizontal: 10,
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
    borderTopWidth: 2,
    borderBottomWidth: 2
  },

  footer: {
    
  }
})