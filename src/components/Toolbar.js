import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, NativeModules, ToolbarAndroid, TouchableNativeFeedback,
  StyleSheet
} from 'react-native'
import { Toolbar } from 'react-native-material-ui'
import Menu from 'react-native-default-menu'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'

MyToolbar.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  textColor: PropTypes.string,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  leftIconProps: PropTypes.object,
  rightIconProps: PropTypes.object,
  actions: PropTypes.array,
  moreIconProps: PropTypes.object,
  onPressLeftIcon: PropTypes.func,
  onPressRightIcon: PropTypes.func,
  onPressActions: PropTypes.func
}

MyToolbar.defaultProps = {
  textColor: 'white'
}

export default function MyToolbar(props){
  const refs = {
    menu: useRef()
  }

  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  return (
    <View style={{
      ...styles.body,
      ...props.style,
      height: 56 + statusBarHeight,
      paddingTop: statusBarHeight
    }}>
      <View style={{ flexDirection: 'row' }}>
        <Button contentContainerStyle={{ padding: 3 }} onPress={() => props.onPressLeftIcon && props.onPressLeftIcon()}>
          <MaterialIcon name={props.leftIcon} size={28} color={props.textColor} {...props.leftIconProps} />
        </Button>
        <Text style={{ ...styles.title, color: props.textColor }}>{props.title}</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {props.rightIcon ? 
          <Button contentContainerStyle={{ padding: 3 }} onPress={() => props.onPressRightIcon && props.onPressRightIcon()}>
            <MaterialIcon name={props.rightIcon} size={28} color={props.textColor} {...props.rightIconProps} style={{ position: 'relative', top: 1 }} />
          </Button>
        : null}

        {props.actions ?
          <Menu options={props.actions} onPress={props.onPressActions} ref={refs.menu}>
            <Button contentContainerStyle={{ padding: 3 }} style={{ marginLeft: 10 }} onPress={() => refs.menu.current.showPopupMenu()}>
              <MaterialIcon name="more-vert" size={28} color={props.textColor} {...props.moreIconProps} style={{ position: 'relative', top: 1 }} />
            </Button>
          </Menu>
        : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    height: 56,
    backgroundColor: $colors.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    color: 'white',
    paddingHorizontal: 15,
  },

  title: {
    marginLeft: 25, 
    color: 'white', 
    fontSize: 19, 
    position: 'relative',
    top: 4.5
  }
})