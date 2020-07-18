import React, { PropsWithChildren } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ArticleSectionData } from '~/api/article/types'
import MyButton from '~/components/MyButton'
import i from '../../lang'
import store from '~/mobx'
import { useObserver } from 'mobx-react-lite'

export interface Props {
  items: ArticleSectionData[]
  onClose (): void
  onPressTitle (anchor: string): void
}

function ArticleContentsBody(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  
  const statusBarHeight = StatusBar.currentHeight!
  const headerHeight = 56 + statusBarHeight
  const nightMode = store.settings.theme === 'night'
  return useObserver(() => {
    return (
      <View 
        style={{ 
          flex: 1,
          backgroundColor: theme.colors.background
        }}
      >
        <View 
          style={{ 
            ...styles.header, 
            height: headerHeight,
            backgroundColor: theme.colors.primary,
            paddingTop: statusBarHeight 
          }}
        >
          <Text style={{ ...styles.headerText, color: nightMode ? theme.colors.text : 'white' }}>{i.contentsView.title}</Text>
          <MaterialIcon 
            style={{ marginRight: 10 }} 
            name="chevron-right" 
            size={40} 
            color={nightMode ? theme.colors.text : 'white'}
            onPress={props.onClose} 
          />
        </View>

        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.titles}
        >
          {
            props.items.filter(item => parseInt(item.level) < 5 && item.level !== '1').map((item, index) => 
              <MyButton onPress={() => props.onPressTitle(item.anchor)}
                rippleColor={theme.colors.placeholder}
                key={index}
              >
                <Text 
                  numberOfLines={1}
                  style={{ 
                    ...(parseInt(item.level) < 3 ? { fontSize: 16, color: theme.colors.disabled } : { fontSize: 14, color: theme.colors.placeholder }),
                    paddingLeft: (parseInt(item.level) - 2) * 10
                  }}
                >{(parseInt(item.level) > 2 ? '- ' : '') + item.line.replace(/<.+?>/g, '')}</Text>
              </MyButton>
            )
          }
        </ScrollView>     
      </View>
    )
  })
}

export default ArticleContentsBody

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 3
  },

  titles: {
    padding: 10
  },

  title: {
    fontSize: 16,
  },

  subTitle: {
    fontSize: 14,
  }
})