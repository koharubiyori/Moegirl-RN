import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal, Animated, ScrollView, TouchableWithoutFeedback,
  StyleSheet, PanResponder, Dimensions
} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'

export const width = 200

Catalog.propTypes = {
  transitionRight: PropTypes.instanceOf(Animated.Value).isRequired,
  transitionMaskOpacity: PropTypes.instanceOf(Animated.Value).isRequired,
  visible: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onTapTitle: PropTypes.func
}

function Catalog(props){
  const refs = {
    mask: useRef()
  }
  const moveEvents = useRef(createMoveEvents())

  function createMoveEvents(){
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) =>{
        var {dx} = gestureState
        if(dx > 50) props.onClose()
      }
    })
  }

  function tapMaskToCloseSelf(e){
    refs.mask.current._component._nativeTag === e.target && props.onClose()
  }

  return (
    <Modal transparent visible={props.visible} onRequestClose={props.onClose}>
      <TouchableWithoutFeedback onPress={tapMaskToCloseSelf}>
        <Animated.View style={{ ...styles.container, opacity: props.transitionMaskOpacity }} ref={refs.mask}>
          <Animated.View {...moveEvents.current.panHandlers} style={{ ...styles.body, right: props.transitionRight }}>
            {/* 蜜汁bug，没有响应事件的地方会无法触发panHandlers，只好在这里加了个TouchableWithoutFeedback */}
            <TouchableWithoutFeedback>
              <View style={{ flex: 1 }}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>目录</Text>
                  <MaterialIcon name="chevron-right" size={40} color="white" style={{ marginRight: 10 }} onPress={props.onClose} />
                </View>

                <ScrollView 
                  style={{ flex: 1 }} 
                  contentContainerStyle={styles.titles}
                >{
                  props.items.filter(item => parseInt(item.level) < 5 && item.level !== '1').map((item, index) => 
                    <Button onPress={() => props.onTapTitle(item.anchor)}
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
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export { Catalog }

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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