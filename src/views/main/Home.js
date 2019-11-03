import React from 'react'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '~/components/webView/ArticleView'
import StatusBar from '~/components/StatusBar'
import Header from './components/Header'

export default function Home(props){
  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <Header title="萌娘百科" />
      <ArticleView style={{ flex: 1 }} link="Mainpage" injectStyle={['index', 'page']}
        navigation={props.navigation}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  
})