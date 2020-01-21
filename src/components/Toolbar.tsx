import PropTypes from 'prop-types'
import React, { useRef, PropsWithChildren } from 'react'
import { NativeModules, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native'
import Menu, { DefaultMenuRef } from 'react-native-default-menu'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import { IconProps } from 'react-native-vector-icons/Icon'

export interface Props {
  title: string
  style?: StyleProp<ViewStyle>
  textColor?: string
  leftIcon?: string
  rightIcon?: string
  leftIconProps?: IconProps
  rightIconProps?: IconProps
  actions?: string[]
  moreIconProps?: IconProps
  onPressLeftIcon? (): void
  onPressRightIcon? (): void
  onPressActions? (eventName: string, index: number): void
}

(MyToolbar as DefaultProps<Props>).defaultProps = {
  textColor: 'white',
  leftIcon: 'keyboard-backspace',
}

type FinalProps = Props

export default function MyToolbar(props: PropsWithChildren<FinalProps>) {
  const refs = {
    menu: useRef<DefaultMenuRef>()
  }

  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  return (
    <View style={{
      ...styles.body,
      ...(props.style as object),
      height: 56 + statusBarHeight,
      paddingTop: statusBarHeight
    }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Button contentContainerStyle={{ padding: 3 }} onPress={() => props.onPressLeftIcon && props.onPressLeftIcon()}>
          <MaterialIcon name={props.leftIcon!} size={28} color={props.textColor} {...props.leftIconProps} />
        </Button>
        <Text style={{ ...styles.title, color: props.textColor }} numberOfLines={1}>{props.title}</Text>
      </View>

      <View style={{ flexDirection: 'row', marginLeft: 10 }}>
        {props.rightIcon ? <>
          <Button contentContainerStyle={{ padding: 3 }} onPress={() => props.onPressRightIcon && props.onPressRightIcon()}>
            <MaterialIcon name={props.rightIcon} size={28} color={props.textColor} {...props.rightIconProps} style={{ position: 'relative', top: 1 }} />
          </Button>
        </> : null}

        {props.actions ? <>
          <Menu options={props.actions} onPress={props.onPressActions} ref={refs.menu}>
            <Button contentContainerStyle={{ padding: 3 }} style={{ marginLeft: 10 }} onPress={() => refs.menu.current!.showPopupMenu()}>
              <MaterialIcon name="more-vert" size={28} color={props.textColor} {...props.moreIconProps} style={{ position: 'relative', top: 1 }} />
            </Button>
          </Menu>
        </> : null}
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
    top: 4.5,
    flex: 1
  }
})