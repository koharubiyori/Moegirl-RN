import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const size = 55

export default class CommentBtn extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      transitionScale: new Animated.Value(1),
      hidden: false   
    }
  }

  show = () =>{
    Animated.timing(this.state.transitionScale, {
      toValue: 1,
      duration: 150
    }).start()
  }
  
  hide = () =>{
    Animated.timing(this.state.transitionScale, {
      toValue: 0,
      duration: 150
    }).start()
  }

  render (){
    return (
      <TouchableOpacity onPress={new Function}>
        <Animated.View style={{ transform: [{ scale: this.state.transitionScale }], ...styles.main }}>
          <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="comment" size={30} color="white" style={{ position: 'relative', top: -4 }} />
            <Text style={{ position: 'absolute', bottom: 3, color: 'white' }}>2</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      // <ActionButton icon="comment" hidden
      //   style={{
      //     container: { backgroundColor: $colors.main, elevation: 2 },
      //     icon: { fontSize: 28 },
      //     positionContainer: { bottom: 50, right: 30 }
      //   }}
      // />
    )
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: $colors.main,
    elevation: 2,
    position: 'absolute',
    bottom: 50,
    right: 30,
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
  }
})