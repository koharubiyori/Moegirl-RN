import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import commentHOC from '~/redux/comment/HOC'

const size = 60

class CommentBtn extends React.Component{
  static propTypes = {
    id: PropTypes.number,
    onTap: PropTypes.func,
    getRef: PropTypes.func
  }

  constructor (props){
    super(props)
    props.getRef && props.getRef(this)
    this.state = {
      transitionScale: new Animated.Value(1),
      visible: false
    }

    this.animateLock = false

    props.comment.setActiveId(props.id)
    props.comment.load()
  }

  componentDidMount (){
    setTimeout(this.show, 2000)
  }

  show = () =>{
    if(this.animateLock || this.state.visible){ return }

    this.animateLock = true
    this.setState({ visible: true }, () => Animated.timing(this.state.transitionScale, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true
    }).start(() =>{
      Animated.timing(this.state.transitionScale, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      }).start(() => this.animateLock = false)
    }))

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
    }), 500)
  }

  tap = () =>{
    var state = this.props.comment.getActiveData()
    if(state.status === 0) this.props.comment.load()
    this.props.onTap()
  }

  render (){
    const state = this.props.comment.getActiveData()

    return (
      !this.state.visible ? null :
      <TouchableOpacity onPress={this.tap} style={{ ...styles.container,  transform: [{ scale: this.state.transitionScale }] }}>
        <Animated.View style={{ ...styles.main }}>
          <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="comment" size={30} color="white" style={{ position: 'relative', top: -4 }} />
            <Text style={{ position: 'absolute', bottom: 6, color: 'white' }}>{{ 0: '×', 1: '...', 2: '...' }[state.status] || state.data.count}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

export default commentHOC(CommentBtn)

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