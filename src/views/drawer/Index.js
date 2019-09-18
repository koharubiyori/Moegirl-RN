import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import { Drawer } from 'react-native-material-ui'

export default class MyDrawer extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      
    }
  }
  

  render (){
    return (
      <View>
        <Drawer>
          <Drawer.Header >
              <Drawer.Header.Account
                  avatar={<Text>aaa</Text>}
                  accounts={[
                    { avatar: <Text>aaa</Text> },
                    { avatar: <Text>aaa</Text> },
                  ]}
                  footer={{
                      dense: true,
                      centerElement: {
                        primaryText: 'Reservio',
                        secondaryText: 'business@email.com',
                      },
                      rightElement: 'arrow-drop-down',
                  }}
              />
          </Drawer.Header>
          <Drawer.Section
              divider
              items={[
                  { icon: 'bookmark-border', value: 'Notifications' },
                  { icon: 'today', value: 'Calendar', active: true },
                  { icon: 'people', value: 'Clients' },
              ]}
          />
          <Drawer.Section
              title="Personal"
              items={[
                  { icon: 'info', value: 'Info' },
                  { icon: 'settings', value: 'Settings' },
              ]}
          />
        </Drawer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})