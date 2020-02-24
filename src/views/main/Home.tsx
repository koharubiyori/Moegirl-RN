import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import ArticleView from '~/components/articleView'
import Header from './components/Header'
import { setThemeColor } from '~/theme'
import { configHOC, ConfigConnectedProps } from '~/redux/config/HOC'

export interface Props {

}

const siteNameMaps = {
  moegirl: '萌娘百科',
  hmoe: 'H萌娘'
}

type FinalProps = Props & __Navigation.InjectedNavigation & ConfigConnectedProps

function Home(props: PropsWithChildren<FinalProps>) {
  const homeStyleName: any = {
    moegirl: 'home',
    hmoe: 'hmoeHome'
  }[props.state.config.source]

  const isNightMode = props.state.config.theme === 'night'
  return (
    <View style={{ flex: 1 }}>
      <Header title={siteNameMaps[props.state.config.source]} />
      <ArticleView 
        style={{ flex: 1 }} 
        link="Mainpage" 
        injectStyle={['article', homeStyleName]}
        navigation={props.navigation}
      />
    </View>
  )
}

export default configHOC(Home)

const styles = StyleSheet.create({
  
})