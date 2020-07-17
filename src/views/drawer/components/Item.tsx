import React, { PropsWithChildren } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Material from 'react-native-vector-icons/MaterialIcons'
import MyButton from '~/components/MyButton'

const iconSize = 30

const Icon = { Material, MaterialCommunity }

export interface Props {
  icon: string | { uri: string }
  iconGroup?: keyof typeof Icon
  title: string
  isOuterLink?: boolean
  onPress(): void
}

;(DrawerItem as DefaultProps<Props>).defaultProps = {
  iconGroup: 'Material',
  isOuterLink: false
}

function DrawerItem(props: PropsWithChildren<Props>) {
  const theme = useTheme()

  return (
    <MyButton onPress={props.onPress} contentContainerStyle={null} rippleColor={theme.colors.accent}>
      <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {typeof props.icon === 'string'
            ? React.createElement(Icon[props.iconGroup!], { name: props.icon, size: iconSize, color: theme.colors.accent })
            : <Image source={props.icon} style={{ width: iconSize, height: iconSize }} /> 
          }
          
          <Text style={{ color: theme.colors.disabled, fontSize: 16, marginLeft: 20, position: 'relative', top: 3.5 }}>{props.title}</Text>
        </View>

        {props.isOuterLink ? <Icon.Material name="launch" size={iconSize} color={theme.colors.primary} /> : null}
      </View>
    </MyButton>
  )
}

export default DrawerItem

const styles = StyleSheet.create({
  
})