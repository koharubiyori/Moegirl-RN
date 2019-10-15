import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { getComments } from '~/api/comment'

const size = 60

export default class CommentBtn extends React.Component{
  static propTypes = {
    id: PropTypes.number,
    onTap: PropTypes.func
  }

  constructor (props){
    super(props)
    this.state = {
      transitionScale: new Animated.Value(1),
      visible: false,
      
      total: 0,
      firstData: null,
      status: 1
    }

    this.animateLock = false
  }

  componentDidMount (){
    setTimeout(this.show, 2000)
    this.getComments()
  }

  show = () =>{
    if(this.animateLock || this.state.visible){ return }

    this.setState({ visible: true })
    this.animateLock = true
    Animated.timing(this.state.transitionScale, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true
    }).start(() =>{
      Animated.timing(this.state.transitionScale, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      }).start(() => this.animateLock = false)
    })
  }
  
  hide = () =>{
    if(this.animateLock || !this.state.visible){ return }

    this.animateLock = true
    setTimeout(() => Animated.timing(this.state.transitionScale, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start(() =>{
      this.setState({ visible: false })
      this.animateLock = false
    }), 1000)
  }

  getComments (){
    this.setState({ status: 2 })
    getComments(this.props.id).then(data =>{
      this.setState({ status: 3, total: data.count, firstData: data })
    }).catch(e =>{
      this.setState({ status: 0 })
    })
  }

  render (){
    return (
      !this.state.visible ? null :
      <TouchableOpacity onPress={this.props.onTap} style={{ ...styles.container,  transform: [{ scale: this.state.transitionScale }] }}>
        <Animated.View style={{ ...styles.main }}>
          <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="comment" size={30} color="white" style={{ position: 'relative', top: -4 }} />
            <Text style={{ position: 'absolute', bottom: 6, color: 'white' }}>{this.state.total}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    right: 30
  },

  main: {
    backgroundColor: $colors.main,
    elevation: 10,
    width: size,
    height: size,
    borderRadius: size / 2
  }
})