import React, { PropsWithChildren } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'

const iconSize = 30

export interface Props {
  icon: string | { uri: string }
  title: string
  isOuterLink?: boolean
  onPress (): void
}

(DrawerItem as DefaultProps<Props>).defaultProps = {
  isOuterLink: false
}

type FinalProps = Props

function DrawerItem(props: PropsWithChildren<FinalProps>) {
  function onPress () {
    $drawer.close()
    props.onPress()
  }

  return (
    <Button onPress={onPress} contentContainerStyle={null} rippleColor={$colors.main} noLimit={false}>
      <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {typeof props.icon === 'string'
            ? <Icon name={props.icon} size={iconSize} color={$colors.main} />
            : <Image source={props.icon} style={{ width: iconSize, height: iconSize }} /> 
          }
          
          <Text style={{ fontSize: 16, marginLeft: 20, color: '#666', position: 'relative', top: 3.5 }}>{props.title}</Text>
        </View>

        {props.isOuterLink ? <Icon name="launch" size={iconSize} color={$colors.light} /> : null}
      </View>
    </Button>
  )
}

export default DrawerItem

const styles = StyleSheet.create({
  
})