import React, { PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import Toolbar from '~/components/Toolbar'
import { date, version } from '~/../app.json'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function About(props: PropsWithChildren<FinalProps>) {

  return (
    <View style={{ flex: 1 }}>
      <StatusBar blackText color="white" />    
      <Toolbar
        title="关于"
        style={{ 
          backgroundColor: 'white'
        }}
        textColor="#666"
        leftIcon="keyboard-backspace"
        onPressLeftIcon={() => props.navigation.goBack()}
      />        

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image source={require('~/assets/images/moegirl.png')} style={{ width: 105, height: 130, marginTop: 50 }} />

        <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginTop: 30, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, color: $colors.main, marginBottom: 10 }}>万物皆可萌的百科全书</Text>
        </View>
        
        <View style={{ marginTop: 20 }}>
          <Item title="版本" value={version}></Item>
          <Item title="更新日期" value={date}></Item>
        
          <View style={styles.item}>
            <Text style={styles.itemText}>开发</Text>
            <TouchableOpacity onPress={() => props.navigation.push('article', { link: 'User:東東君' })}>
              <Text style={{ color: $colors.sub, fontSize: 16, textDecorationLine: 'underline' }}>東東君</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>    
    </View>
  )
}

export default About

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', 
    width: 210, 
    justifyContent: 'space-between', 
    marginTop: 5
  },

  itemText: {
    fontSize: 16, 
    color: '#666', 
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
      <Text style={{ fontSize: 16, color: '#666' }}>{value}</Text>
    </View>
  )
}