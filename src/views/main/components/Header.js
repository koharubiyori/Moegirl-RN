import React from 'react'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import iconBtnStyle from '~/styles/header/iconBtnStyle'
import { NavigationContext } from '../Index'

export default class IndexHeader extends React.Component{
  constructor (props){
    super(props)
    this.state = {
      showToast: false
    }

    this.iconStyle = iconBtnStyle
  }
  
  openDrawer = () =>{
    console.log(true)
  }

  render (){
    return (
      <NavigationContext.Consumer>{navigation =>
        <View style={styles.body}>
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={this.openDrawer}>
              <Icon name="menu" {...this.iconStyle} />
            </Button>
            
            <Text style={styles.title}>{this.props.children}</Text>
          </View>

          <View>
            <Button onPress={() => navigation.push('search')}>
              <Icon name="search" {...this.iconStyle} />
            </Button>
          </View>
        </View>
      }</NavigationContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    ...$theme.mainBg,
    paddingHorizontal: 15,
    height: 55,
    elevation: 3,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  title: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5
  }
})