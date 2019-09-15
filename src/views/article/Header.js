import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated,
  StyleSheet, NativeModules, Dimensions
} from 'react-native'
import { Toolbar } from 'react-native-material-ui'

export default class ArticleHeader extends React.Component{
  static propTypes = {
    style: PropTypes.object,
    navigation: PropTypes.object,
  }

  constructor (props){
    super(props)
    this.state = {
      visible: true,
      transitionTop: new Animated.Value(0)
    }
    
  }
  
  openDrawer = () =>{
    console.log(true)
  }

  toSearchView = () =>{}

  hide = () =>{
    if(!this.state.visible){ return }
    this.setState({ visible: false })

    Animated.timing(this.state.transitionTop, {
      toValue: -56,
      duration: 200
    }).start()
  }

  show = () =>{
    if(this.state.visible){ return }
    this.setState({ visible: true })

    Animated.timing(this.state.transitionTop, {
      toValue: 0,
      duration: 200
    }).start()
  }

  eventHandlers = (event, navigation) =>{
    if(event.action === 'search'){
      navigation.push('search')
    }
  }

  render (){
    return (
      <Animated.View style={{ ...styles.body, ...this.props.style, top: this.state.transitionTop }}>
        <Toolbar
          leftElement="keyboard-backspace"
          centerElement={this.props.title}
          rightElement={{
            actions: [
              'search'
            ],

            menu: {
                icon: 'more-vert',
                labels: ['item 1', 'item 2']
            }
          }}

          onLeftElementPress={() => this.props.navigation.goBack()}
          onRightElementPress={event =>{ this.eventHandlers(event, this.props.navigation) }}
        />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    // ...$theme.mainBg,
    // paddingHorizontal: 15,
    // height,
    // elevation: 3,

    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    zIndex: 1
  },
  
  title: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5,
    flexShrink: 1,
    maxWidth: Dimensions.get('window').width / 2
  },

  rightBtnContainer: {
    flexDirection: 'row-reverse'
  },

  rightBtn: {
    marginRight: 5
  }
})