import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'

DrawerItem.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  isOuterLink: PropTypes.bool,

  onPress: PropTypes.func
}

const iconSize = 30

export default function DrawerItem({
  icon,
  title,
  isOuterLink = false,
  onPress
}){
  return (
    <Button onPress={onPress} contentContainerStyle={null} rippleColor="#ccc" noLimit={false}>
      <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {typeof icon === 'string' ?
            <Icon name={icon} size={iconSize} color={$colors.main} />
          :
            <Image source={icon} style={{ width: iconSize, height: iconSize }} /> 
          }
          
          <Text style={{ fontSize: 20, marginLeft: 10, color: '#666' }}>{title}</Text>
        </View>

        {isOuterLink ? <Icon name="launch" size={iconSize} color={$colors.light} /> : null}
      </View>
    </Button>
  )
}

const styles = StyleSheet.create({
  
})