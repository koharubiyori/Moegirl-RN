import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, Image,
  StyleSheet
} from 'react-native'
import Button from '~/components/Button'

HistoryItem.propTypes = {
  data: PropTypes.object,
  onPress: PropTypes.func
}

export default function HistoryItem({
  data, onPress
}){
  return (
    <Button contentContainerStyle={styles.container} noLimit={false} rippleColor={$colors.light}
      onPress={() => onPress(data.title)}
    >
      <Image source={data.img || require('~/assets/images/moemoji.png')} resizeMode="cover" style={{ width: 60, height: 70, position: 'absolute', top: 5, left: 5 }} />
      <Text style={{ maxWidth: 14 * 15, textAlign: 'center' }} numberOfLines={2}>{data.title}</Text>
      <Text style={{ position: 'absolute', right: 5, bottom: 5 }}>{data.date}</Text>
    </Button>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 1
  }
})