import React from 'react'
import { Animated, StyleSheet } from 'react-native'

export default class extends React.Component{
  constructor (props){
    super(props)
    this.state = {
      fadeInOpacity: new Animated.Value(0)
    }
  }
  
  componentDidMount (){
    Animated.timing(this.state.fadeInOpacity, {
      toValue: 1,
      duration: 600
    }).start()
  }

  render (){
    return (
      <Animated.View style={{ ...this.props.style, opacity: this.state.fadeInOpacity }}>
        {this.props.children}
      </Animated.View>
    )
  }
}


