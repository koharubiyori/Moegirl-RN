import React, { PropsWithChildren, useRef, useState } from 'react'
import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { date, version } from '~/../app.json'
import Button from '~/components/Button'
import StatusBar from '~/components/StatusBar'
import Toolbar from '~/components/Toolbar'
import { ConfigConnectedProps, configHOC } from '~/redux/config/HOC'
import { colors } from '~/theme'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & ConfigConnectedProps

function About(props: PropsWithChildren<FinalProps>) {
  const [isDebauched, setIsDebauched] = useState(false)
  const debauchPress = useRef({
    count: 0,
    timeoutKey: 0
  })

  function debauch() {
    // const toast = (msg: string) => ToastAndroid.show(msg, 3000)
    // if (isDebauched) {
    //   toast('你还需要推到墙娘(小声)')
    // } else {
    //   const dpc = debauchPress.current
    //   clearTimeout(dpc.timeoutKey)
    //   dpc.count++
    //   dpc.timeoutKey = setTimeout(() => dpc.count = 0, 5000) as any
    //   if (dpc.count === 3) {
    //     toast('嗯？')
    //   }
    //   if (dpc.count === 4) {
    //     toast('你在做什么呀')
    //   }
    //   if (dpc.count === 5) {
    //     toast('不...不要盯着人家那里看啦')
    //   }
    //   if (dpc.count === 6) {
    //     toast('H是不行的...，快不要这样做了')
    //   }
    //   if (dpc.count === 7) {
    //     toast('你成功推到了萌百娘')
    //     setIsDebauched(true)
    //     props.$config.set({ showSiteSelector: true })
    //   }
    // }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar blackText />    
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

        <Button 
          noLimit={false}
          style={{ marginTop: 30 }} 
          contentContainerStyle={{ borderBottomColor: '#ccc', borderBottomWidth: 1, paddingHorizontal: 20 }}
          rippleColor={colors.green.primary}
          onPress={() => debauch()}
        >
          <Text style={{ fontSize: 18, color: colors.green.primary, marginVertical: 10 }}>
            <Text>万物皆可</Text>
            {isDebauched ? <Text style={{ color: colors.pink.primary }}>H</Text> : <Text>萌</Text>}
            <Text>的百科全书</Text>
          </Text>
        </Button>
        
        <View style={{ marginTop: 20 }}>
          <Item title="版本" value={version}></Item>
          <Item title="更新日期" value={date}></Item>
        
          <View style={styles.item}>
            <Text style={styles.itemText}>开发</Text>
            <TouchableOpacity onPress={() => props.navigation.push('article', { link: 'User:東東君' })}>
              <Text style={{ color: colors.green.accent, fontSize: 16, textDecorationLine: 'underline' }}>東東君</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>    
    </View>
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