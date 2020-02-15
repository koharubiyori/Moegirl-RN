import React, { FC, PropsWithChildren, useRef } from 'react'
import { Animated, NativeModules, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import Menu, { DefaultMenuRef } from 'react-native-default-menu'
import { IconProps } from 'react-native-vector-icons/Icon'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'

export interface Props {
  title: string
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle> // 这个属性主要是为了支持文章节目的头栏动画
  textColor?: string
  leftIcon?: string
  rightIcon?: string
  badge?: boolean
  leftIconProps?: IconProps
  rightIconProps?: IconProps
  actions?: string[]
  moreIconProps?: IconProps
  disabledMoreBtn?: boolean
  onPressLeftIcon? (): void
  onPressRightIcon? (): void
  onPressActions? (eventName: string, index: number): void
}

(MyToolbar as DefaultProps<Props>).defaultProps = {
  textColor: 'white',
  leftIcon: 'keyboard-backspace',
}

type FinalProps = Props & UserConnectedProps

function MyToolbar(props: PropsWithChildren<FinalProps>) {
  const refs = {
    menu: useRef<DefaultMenuRef>()
  }

  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  return (
    <Animated.View style={{
      ...styles.body,
      ...(props.style as object),
      height: 56 + statusBarHeight,
      paddingTop: statusBarHeight
    }}>
      <Animated.View style={{ ...(props.contentContainerStyle as any), flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Button contentContainerStyle={{ padding: 3 }} onPress={() => props.onPressLeftIcon && props.onPressLeftIcon()}>
            <MaterialIcon name={props.leftIcon!} size={28} color={props.textColor} {...props.leftIconProps} />
            {props.state.user.waitNotificationsTotal !== 0 && props.badge ? <View style={styles.badge} /> : null} 
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
              <Button contentContainerStyle={{ padding: 3 }} style={{ marginLeft: 10 }} onPress={() => !props.disabledMoreBtn && refs.menu.current!.showPopupMenu()}>
                <MaterialIcon name="more-vert" size={28} color={props.textColor} {...props.moreIconProps} style={{ position: 'relative', top: 1 }} />
              </Button>
            </Menu>
          </> : null}
        </View>
      </Animated.View>
    </Animated.View>
  )
}

export default userHOC(MyToolbar) as FC<Props>

const styles = StyleSheet.create({
  body: {
    height: 56,
    backgroundColor: $colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },

  badge: {
    width: 9,
    height: 9,
    backgroundColor: 'red',
    borderRadius: 4.5,
    position: 'absolute',
    top: 3,
    right: 0,
  }
})