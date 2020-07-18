import React, { PropsWithChildren } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { date, isHmoe, version } from '~/../app.json'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import { colors } from '~/theme'
import ViewContainer from '~/components/ViewContainer'
import i from './lang'

export interface Props {

}

export interface RouteParams {

}

function AboutPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()

  const isNightMode = store.settings.theme === 'night'
  return (
    <ViewContainer>
      <MyStatusBar blackText />    
      <MyToolbar
        title={i.index.title}
        style={{ 
          backgroundColor: isNightMode ? theme.colors.primary : 'white',
        }}
        textColor={isNightMode ? theme.colors.onSurface : theme.colors.disabled}
        leftIcon="keyboard-backspace"
        onPressLeftIcon={() => navigation.goBack()}
      />        

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image source={require('~/assets/images/moegirl.png')} style={{ width: 105, height: 130, marginTop: 50 }} />

        <View style={{ marginTop: 30, borderBottomColor: '#ccc', borderBottomWidth: 1, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, color: colors.green.primary, marginVertical: 10 }}>{i.index.catchCopy}</Text>
        </View>
        
        <View style={{ marginTop: 20 }}>
          <Item title={i.index.version} value={version + (isHmoe ? 'H' : '')}></Item>
          <Item title={i.index.updateDate} value={date}></Item>
        
          <View style={styles.item}>
            <Text style={{ ...styles.itemText }}>{i.index.develop}</Text>
            <TouchableOpacity onPress={() => navigation.push('article', { pageName: 'User:東東君' })}>
              <Text style={{ color: colors.green.accent, fontSize: 16, textDecorationLine: 'underline' }}>{i.index.myName}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>    
    </ViewContainer>
  )
}

export default AboutPage

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', 
    width: 210, 
    justifyContent: 'space-between', 
    marginTop: 5
  },

  itemText: {
    fontSize: 16, 
    width: 80, 
    textAlign: 'center'
  }
})

function Item({
  title, value
}: { title: string, value: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{title}</Text>
      <Text style={{ fontSize: 16 }}>{value}</Text>
    </View>
  )
}