import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal, Animated, ScrollView, TouchableWithoutFeedback,
  StyleSheet, 
} from 'react-native'
import Button from '~/components/Button'

export const width = 200

// 虽然这个组件主要只负责显示视图，但因为需要根据组件id判断是否点击了mask，所以不能写成函数组件( 用React.createRef()还是能写成函数组件的，懒得改了_(:з」∠)_
export class Catalog extends React.Component{
  static propTypes = {
    transitionRight: PropTypes.instanceOf(Animated.Value).isRequired,
    transitionMaskOpacity: PropTypes.instanceOf(Animated.Value).isRequired,
    visible: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    onClose: PropTypes.func,
    onTapTitle: PropTypes.func
  }

  constructor (props){
    super(props)
    this.state = {

    }
  }

  // 使用组件id判断是否点击的是mask
  tapMaskToCloseSelf = e =>{
    this.refs.mask._component._nativeTag === e.target && this.props.onClose()
  }

  render (){
    return (
      <Modal transparent visible={this.props.visible} onRequestClose={this.props.onClose}>
        <TouchableWithoutFeedback onPress={this.tapMaskToCloseSelf}>
          <Animated.View style={{ ...styles.container, opacity: this.props.transitionMaskOpacity }} ref="mask">
            <Animated.View style={{ ...styles.body, right: this.props.transitionRight }}>
              <View style={styles.header}>
                <Text style={styles.headerText}>目录</Text>
              </View>

              <ScrollView contentContainerStyle={styles.titles}>{
                this.props.items.filter(item => parseInt(item.level) < 5 && item.level !== '1').map((item, index) => 
                  <Button onPress={() => this.props.onTapTitle(item.anchor)}
                    rippleColor="#ccc"
                    noLimit={false}
                    key={index}
                  >
                    <Text 
                      numberOfLines={1}
                      style={{ 
                        ...(parseInt(item.level) < 3 ? styles.title : styles.subTitle),
                        paddingLeft: (parseInt(item.level) - 2) * 5
                      }}
                    >{(parseInt(item.level) > 2 ? '- ' : '') + item.line}</Text>
                  </Button>
                )
              }</ScrollView>
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
    height: 56,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: $colors.main
  },

  headerText: {
    fontSize: 18,
    color: 'white'
  },

  titles: {
    padding: 10
  },

  title: {
    fontSize: 16,
    color: $colors.main
  },

  subTitle: {
    fontSize: 14,
    color: '#bbb'
  }
})