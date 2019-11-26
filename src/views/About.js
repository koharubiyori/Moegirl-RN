import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Toolbar } from 'react-native-material-ui'
import { date, version } from '../../app.json'

function Item({
  title, value
}){
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{title}</Text>
      <Text style={{ fontSize: 16, color: '#666' }}>{value}</Text>
    </View>
  )
}

export default class About extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      
    }

    this.version = global.$lastUpdateVersion || version
    this.date = global.$lastUpdateDate || date
  }

  render (){
    return (
      <View style={{ flex: 1 }}>
        <StatusBar blackText color="white" />    
        <Toolbar size={26}
          style={{ 
            container: { backgroundColor: 'white' }, 
            titleText: { color: '#666' },
            leftElement: { color: '#666' }
          }}
          leftElement="keyboard-backspace"
          centerElement="关于"
          onLeftElementPress={() => this.props.navigation.goBack()}
        />        

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image source={require('~/assets/images/moegirl.png')} style={{ width: 105, height: 130, marginTop: 50 }} />

          <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginTop: 30, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 18, color: $colors.main, marginBottom: 10 }}>万物皆可萌的百科全书</Text>
          </View>
          
          <View style={{ marginTop: 20 }}>
            <Item title="版本" value={this.version}></Item>
            <Item title="更新日期" value={this.date}></Item>
          
            <View style={styles.item}>
              <Text style={styles.itemText}>开发</Text>
              <TouchableOpacity onPress={() => this.props.navigation.push('article', { link: 'User:東東君' })}>
                <Text style={{ color: $colors.sub, fontSize: 16, textDecorationLine: 'underline' }}>東東君</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>    
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', 
    width: 210, 
    justifyContent: 'space-between', 
    marginTop: 5
  },

  itemText: {
    fontSize: 16, 
    color: '#666', 
    width: 80, 
    textAlign: 'center'
  }
})