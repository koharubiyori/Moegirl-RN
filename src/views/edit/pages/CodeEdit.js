import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TextInput, ActivityIndicator, Dimensions,
  StyleSheet
} from 'react-native'
import Button from '~/components/Button'
import { getCode } from '~/api/edit'

export default class CodeEdit extends React.Component{
  static propTypes = {

  }

  constructor (props){
    super(props)
    this.state = {
      content: '',
      status: 1,
    }

    this.initContentSample = ''
  }

  componentDidMount (){    
    this.loadCode()
  }

  // componentDidUpdate (prevProps, prevState){
  //   console.log(!prevState.content, !!this.state.content)
  //   if(!prevState.content && this.state.content){
  //     this.refs.textInput && this.refs.textInput.setNativeProps({ selection: { start: 0, end: 0 } })
  //     setTimeout(() => this.refs.textInput.setNativeProps({ selection: null }), 100)
  //   }
  // }

  loadCode = () =>{
    this.setState({ status: 2 })
    const {title, section} = this.props.navigation.getScreenProps()
    getCode(title, section).then(data =>{
      const content = data.parse.wikitext['*']
      this.setState({ content, status: 3 }, () =>{
        console.log(this.refs.textInput)
        this.refs.textInput.setNativeProps({ selection: { start: 0, end: 0 } })
        setTimeout(() => this.refs.textInput.setNativeProps({ selection: null }))
      })
      this.props.navigation.setParams({ loadStatus: 3, content })
      this.initContentSample = content
    }).catch(e =>{
      this.setState({ status: 0 })
      this.props.navigation.setParams({ status: 0 })
    })
  }

  getSourceCode (){
    return this.state.content
  }

  changeText = text =>{
    this.setState({ content: text })
    this.props.navigation.setParams({ content: text, isContentChanged: this.initContentSample !== text })
  }

  render (){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {{
          0: () => <Button primary text="重新加载" onPress={this.loadCode}></Button>,
          1: () => null, 
          2: () => <ActivityIndicator color={$colors.main} size={50} />,
          3: () => <TextInput autoFocus multiline disableFullscreenUI autoCorrect={false} 
            style={{ flex: 1, width: Dimensions.get('window').width, paddingVertical: 0 }}
            textAlignVertical="top" 
            value={this.state.content}
            onChangeText={this.changeText}
            ref="textInput"
          />
        }[this.state.status]()}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})