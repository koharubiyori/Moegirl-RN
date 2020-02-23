import React, { PropsWithChildren } from 'react'
import { Dimensions, NativeModules, ScrollView, StyleSheet, Text, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import { useTheme } from 'react-native-paper'

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
  const theme = useTheme()
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  const titleHeight = props.immersionMode ? { height: 56 } : { height: 56 + statusBarHeight, paddingTop: statusBarHeight }

  return (
    <View style={{ height: Dimensions.get('window').height, backgroundColor: theme.colors.background }}>
      <View style={{ ...styles.header, ...titleHeight, backgroundColor: props.backgroundColor }}>
        <Text style={{ ...styles.headerText, color: props.textColor }}>目录</Text>
        <MaterialIcon name="chevron-right" size={40} color={props.textColor} style={{ marginRight: 10 }} onPress={props.onClose} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.titles}
      >{
          props.items.filter(item => parseInt(item.level) < 5 && item.level !== '1').map((item, index) => 
            <Button onPress={() => props.onPressTitle(item.anchor)}
              rippleColor={theme.colors.placeholder}
              noLimit={false}
              key={index}
            >
              <Text 
                numberOfLines={1}
                style={{ 
                  ...(parseInt(item.level) < 3 ? { fontSize: 16, color: theme.colors.disabled } : { fontSize: 14, color: theme.colors.placeholder }),
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