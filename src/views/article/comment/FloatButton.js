import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const size = 60

export default class CommentBtn extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      transitionScale: new Animated.Value(1),
      visible: false
    }
  }

  show = () =>{
    if(this.state.visible){ return }
    this.setState({ visible: true })
    Animated.timing(this.state.transitionScale, {
      toValue: 1,
      duration: 100,
      // useNativeDriver: true
    }).start()
  }
  
  hide = () =>{
    if(!this.state.visible){ return }
    Animated.timing(this.state.transitionScale, {
      toValue: 0,
      duration: 100,
      // useNativeDriver: true
    }).start(() => this.setState({ visible: false }))
  }

  render (){
    return (
      <TouchableOpacity onPress={() => console.log(true)} style={{ ...styles.container,  transform: [{ scale: this.state.transitionScale }] }}>
        <Animated.View style={{ ...styles.main }}>
          <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="comment" size={30} color="white" style={{ position: 'relative', top: -4 }} />
            <Text style={{ position: 'absolute', bottom: 6, color: 'white' }}>2</Text>
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
  container: {
    position: 'absolute',
    bottom: 50,
    right: 30, 
  },

  main: {
    backgroundColor: $colors.main,
    elevation: 2,
    width: size,
    height: size,
    borderRadius: size / 2,
    opacity: 0.5
  }
})