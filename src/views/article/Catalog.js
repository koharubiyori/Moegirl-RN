import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal, Animated, ScrollView, TouchableWithoutFeedback,
  StyleSheet, 
} from 'react-native'
import { height } from './Header'

export const width = 200

export default class Catalog extends React.Component{
  static propTypes = {
    transitionRight: PropTypes.instanceOf(Animated.Value).isRequired,
    transitionMaskOpacity: PropTypes.instanceOf(Animated.Value).isRequired,
    visible: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    onClose: PropTypes.func
  }

  constructor (props){
    super(props)
    this.state = {

    }

    console.log(props.transitionRight)
  }

  onTapMaskCloseSelf = e =>{
    console.log(new e)
    // console.log(e.currentTarget())
  }

  maskBgColor (){
    return `rgba(0, 0, 0, ${0.3 * this.props.transitionMaskOpacity._value / 100})`
  }

  render (){
    return (
      <Modal transparent visible={this.props.visible} onRequestClose={this.props.onClose}>
        <TouchableWithoutFeedback onPress={this.onTapMaskCloseSelf}>
          <Animated.View style={{ ...styles.container, backgroundColor: this.maskBgColor() }} ref="mask">
            <Animated.View style={{ ...styles.body, right: this.props.transitionRight }}>
              <View style={styles.header}>
                <Text style={styles.headerText}>目录</Text>
              </View>

              <ScrollView contentContainerStyle={styles.list}>{this.props.items}</ScrollView>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },

  body: {
    width,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 100
  },

  header: {
    height,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: $colors.main
  },

  headerText: {
    fontSize: 18,
    color: 'white'
  },

  list: {
    padding: 10
  }
})