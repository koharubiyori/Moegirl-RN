import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, BackHandler, DeviceEventEmitter,
  StyleSheet, 
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import Header from './Header'
import TabNavigator from './TabNavigator'
import { editArticle } from '~/api/edit'
import toast from '~/utils/toast'

export default class Edit extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      status: 1,
      content: '',
    }

    this.essentialUpdate = false
    this.articleReloadFlag = false

    DeviceEventEmitter.addListener('navigationStateChange', (prevState, state) =>{
      var lastRoute = state.routes[state.routes.length - 1]
      if(this.articleReloadFlag && lastRoute.routeName === 'article'){
        this.articleReloadFlag = false
        console.log(lastRoute)
      }
    })
  }

  // 监听tab导航容器的状态变化，在编辑器内容变更且用户查看预览时refresh预览视图
  navigationStateChange = (prevState, state) =>{
    if(!state.routes[0].params){ return }
    const {status, content} = state.routes[0].params
    const {refresh} = state.routes[1].params

    this.setState({ status, content })
    if(!prevState.routes[0].params && content) return refresh && refresh(content)

    // 如果内容不同，则标记为需要刷新
    if((prevState.routes[0].params.content !== content) && state.index === 0){ this.essentialUpdate = true }
    if(this.essentialUpdate && state.index === 1){
      this.essentialUpdate = false
      refresh && refresh(content)
    }
  }

  backHandler = () =>{
    const {params} = this.refs.tabNavigator.state.nav.routes[0]
    BackHandler.addEventListener('hardwareBackPress', () =>{
      if(params && params.isContentChanged){
        $dialog.confirm.show({
          content: '编辑还未保存，确定要放弃编辑的内容？',
          onTapCheck: () => this.props.navigation.goBack()
        })
  
        return true
      }
    })
  }

  submit = () =>{
    const {content, isContentChanged} = this.refs.tabNavigator.state.nav.routes[0].params
    if(isContentChanged){
      
      $dialog.confirm.show({
        hasInput: true,
        inputPlaceholder: '请输入编辑摘要',
        onTapCheck: text =>{
          toast.showLoading('提交中')
          editArticle(this.props.navigation.getParam('title'), this.props.navigation.getParam('section'), content, text.trim())
          .finally(toast.hide)
          .then(() =>{
            setTimeout(() => toast.showSuccess('编辑成功'))
            this.articleReloadFlag = true
            this.props.navigation.goBack()
          })
          .catch(code =>{
            if(code){
              $dialog.alert({
                editconflict: '出现编辑冲突，请复制编辑的内容后再次进入编辑界面，并检查差异',
                protectedpage: '没有权限编辑此页面！',
                readonly: '目前数据库处于锁定状态，无法编辑'
              }[code] || '未知错误')
            }else{
              $dialog.alert('网络错误，请稍候再试')
            }             
          })
        }
      })
    }else{
      toast.show('内容未发生变化')
    }
  }

  render (){
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar />
        <Header title={this.props.navigation.getParam('title')} navigation={this.props.navigation} onTapDoneBtn={this.submit} />
        <TabNavigator 
          screenProps={{ 
            title: this.props.navigation.getParam('title'),
            section: this.props.navigation.getParam('section'),
            content: this.state.content
          }}
          onNavigationStateChange={this.navigationStateChange}
          ref="tabNavigator"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})