import React from 'react'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Header from '@/components/header/IndexHeader'
import ArticleView from '@/components/webView/ArticleView'
import StatusBar from '@/components/StatusBar'

Home.propTypes = {
  style: PropTypes.object
}

export default function Home(props){
  return (
    <View style={props.style}>
      <StatusBar />
      <Header />
      <ArticleView style={{ flex: 1 }} link="Mainpage" injectStyle={['index', 'page']}
        injectScript={['link']}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  
})