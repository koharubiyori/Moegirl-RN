import React from 'react'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '~/components/webView/ArticleView'
import StatusBar from '~/components/StatusBar'
import { NavigationContext } from '~/views/main/Index'
import Header from './components/Header'

Home.propTypes = {
  style: PropTypes.object
}

export default function Home(props){
  console.log('home')

  return (
    <NavigationContext.Consumer>{navigation =>
      <View style={props.style}>
        <StatusBar />
        <Header>萌娘百科</Header>
        <ArticleView style={{ flex: 1 }} link="Mainpage" injectStyle={['index', 'page']}
          injectScript={['link']} navigation={navigation}
        />
      </View>
    }</NavigationContext.Consumer>
  )
}

const styles = StyleSheet.create({
  
})