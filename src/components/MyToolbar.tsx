import React, { PropsWithChildren, useState } from 'react'
import { Animated, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Menu, Text, useTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MyButton from '~/components/MyButton'
import { IconProps } from 'react-native-vector-icons/Icon'
import { useObserver } from 'mobx-react-lite'

export interface Props {
  title: string
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle> // 这个属性主要是为了支持文章界面的头栏动画
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
  onPressAction? (actionName: string, index: number): void
}

;(MyToolbar as DefaultProps<Props>).defaultProps = {
  leftIcon: 'keyboard-backspace',
}

function MyToolbar(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const [visibleMenu, setVisibleMenu] = useState(false)

  function pressAction(actionName: string, index: number) {
    setVisibleMenu(false)
    props.onPressAction && props.onPressAction(actionName, index)
  }

  const statusBarHeight = StatusBar.currentHeight!
  const textColor = props.textColor || theme.colors.onSurface
  return useObserver(() => 
    <Animated.View style={{
      ...styles.body,
      backgroundColor: theme.colors.primary,
      ...(props.style as object),
      height: 56 + statusBarHeight,
      paddingTop: statusBarHeight
    }}>
      <Animated.View style={{ ...(props.contentContainerStyle as any), flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <MyButton noRippleLimit contentContainerStyle={{ padding: 3 }} onPress={() => props.onPressLeftIcon && props.onPressLeftIcon()}>
            <MaterialIcon name={props.leftIcon!} size={28} color={textColor} {...props.leftIconProps} />
            {props.badge && <View style={{ ...styles.badge, backgroundColor: theme.colors.error }} />} 
          </MyButton>
          <Text style={{ ...styles.title, color: textColor }} numberOfLines={1}>{props.title}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          {props.rightIcon &&
            <MyButton noRippleLimit contentContainerStyle={{ padding: 3 }} onPress={() => props.onPressRightIcon && props.onPressRightIcon()}>
              <MaterialIcon name={props.rightIcon} size={28} color={textColor} {...props.rightIconProps} style={{ position: 'relative', top: 1 }} />
            </MyButton>
          }
          
          {props.actions && <>
            <Menu
              visible={visibleMenu}
              statusBarHeight={statusBarHeight}
              onDismiss={() => setVisibleMenu(false)}
              anchor={
                <MyButton noRippleLimit contentContainerStyle={{ padding: 3 }} style={{ marginLeft: 10 }} onPress={() => !props.disabledMoreBtn && setVisibleMenu(true)}>
                  <MaterialIcon name="more-vert" size={28} color={textColor} {...props.moreIconProps} style={{ position: 'relative', top: 1 }} />
                </MyButton>
              }
            >
              {props.actions.map((actionName, index) => <Menu.Item 
                key={index}
                style={{ paddingVertical: 5 }}
                title={actionName}
                onPress={() => pressAction(actionName, index)}
              />)}
            </Menu>
          </>}
        </View>
      </Animated.View>
    </Animated.View>
  )
}

export default MyToolbar

const styles = StyleSheet.create({
  body: {
    height: 56,
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
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4.5,
    position: 'absolute',
    top: 3,
    right: 0,
  }
})