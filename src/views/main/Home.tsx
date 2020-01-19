import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import ArticleView from '~/components/articleView/Index'
import Header from './components/Header'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

function Home(props: PropsWithChildren<FinalProps>) {

  return (
    <View style={{ flex: 1 }}>
      <Header title="萌娘百科" />
      <ArticleView style={{ flex: 1 }} link="Mainpage" injectStyle={['index', 'page']}
        navigation={props.navigation}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  
})