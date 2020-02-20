import React, { PropsWithChildren } from 'react'
import { Dimensions, NativeModules, ScrollView, StyleSheet, Text, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'

export interface Props {
  immersionMode: boolean
  items: any[]
  backgroundColor: string
  textColor: string
  onClose (): void
  onPressTitle (anchor: string): void
}

type FinalProps = Props

function CatalogBody(props: PropsWithChildren<FinalProps>) {
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  const titleHeight = props.immersionMode ? { height: 56 } : { height: 56 + statusBarHeight, paddingTop: statusBarHeight }

  return (
    <View style={{ ...styles.container, height: Dimensions.get('window').height }}>
      <View style={{ ...styles.header, ...titleHeight, backgroundColor: props.backgroundColor }}>
        <Text style={{ ...styles.headerText, color: props.textColor }}>目录</Text>
        <MaterialIcon name="chevron-right" size={40} color="white" style={{ marginRight: 10 }} onPress={props.onClose} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.titles}
      >{
          props.items.filter(item => parseInt(item.level) < 5 && item.level !== '1').map((item, index) => 
            <Button onPress={() => props.onPressTitle(item.anchor)}
              rippleColor="#ccc"
              noLimit={false}
              key={index}
            >
              <Text 
                numberOfLines={1}
                style={{ 
                  ...(parseInt(item.level) < 3 ? { ...styles.title } : styles.subTitle),
                  paddingLeft: (parseInt(item.level) - 2) * 10
                }}
              >{(parseInt(item.level) > 2 ? '- ' : '') + item.line}</Text>
            </Button>
          )
        }</ScrollView>     
    </View>
  )
}

export default CatalogBody

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },

  header: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 18,
    color: 'white'
  },

  titles: {
    padding: 10
  },

  title: {
    fontSize: 16,
    color: '#666'
  },

  subTitle: {
    fontSize: 14,
    color: '#bbb'
  }
})