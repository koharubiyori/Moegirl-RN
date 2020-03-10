import React, { PropsWithChildren } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { date, isHmoe, version } from '~/../app.json'
import StatusBar from '~/components/StatusBar'
import Toolbar from '~/components/Toolbar'
import ViewContainer from '~/components/ViewContainer'
import { ConfigConnectedProps, configHOC } from '~/redux/config/HOC'
import { colors } from '~/theme'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & ConfigConnectedProps

function About(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()

  const isNightMode = props.state.config.theme === 'night'
  return (
    <ViewContainer>
      <StatusBar blackText />    
      <Toolbar
        title="关于"
        style={{ 
          backgroundColor: isNightMode ? theme.colors.primary : 'white',
        }}
        textColor={isNightMode ? theme.colors.onSurface : theme.colors.disabled}
        leftIcon="keyboard-backspace"
        onPressLeftIcon={() => props.navigation.goBack()}
      />        

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image source={require('~/assets/images/moegirl.png')} style={{ width: 105, height: 130, marginTop: 50 }} />

        <View style={{ marginTop: 30, borderBottomColor: '#ccc', borderBottomWidth: 1, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, color: colors.green.primary, marginVertical: 10 }}>万物皆可萌的百科全书</Text>
        </View>
        
        <View style={{ marginTop: 20 }}>
          <Item title="版本" value={version + (isHmoe ? 'H' : '')}></Item>
          <Item title="更新日期" value={date}></Item>
        
          <View style={styles.item}>
            <Text style={{ ...styles.itemText }}>开发</Text>
            <TouchableOpacity onPress={() => props.navigation.push('article', { link: 'User:東東君' })}>
              <Text style={{ color: colors.green.accent, fontSize: 16, textDecorationLine: 'underline' }}>東東君</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>    
    </ViewContainer>
  )
}

export default configHOC(About)

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