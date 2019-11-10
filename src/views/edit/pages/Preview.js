import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ActivityIndicator,
  StyleSheet
} from 'react-native'
import ArticleView from '~/components/articleView/Index'
import { Button } from 'react-native-material-ui'
import { getPreview } from '~/api/edit'

export default class Preview extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      html: '',
      status: 1
    }

    props.navigation.setParams({ refresh: this.parseCodes })
  }
  
  parseCodes = argContent =>{
    this.setState({ status: 2 })
    const {content, title} = this.props.navigation.getScreenProps()
    getPreview(argContent || content, title).then(data =>{
      this.setState({ status: 3, html: data.parse.text['*'] })
    }).catch(e =>{
      this.setState({ status: 0 })
    })
  }

  render (){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {{
          0: () => <Button primary text="重新加载" onPress={() => this.parseCodes()}></Button>,
          1: () => null,
          2: () => <ActivityIndicator color={$colors.main} size={50} />,
          3: () => <ArticleView disabledLink style={{ flex: 1 }} html={this.state.html} injectStyle={['page']} navigation={this.props.navigation} />
        }[this.state.status]()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})