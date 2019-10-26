import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'

HistoryTitle.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object
}

export default function HistoryTitle({
  text, style
}){
  return (
    <View style={{ ...style, marginVertical: 5 }}>
      <Text style={{ marginLeft: 5, color: $colors.main, fontSize: 16 }}>{text}</Text>      
      <View style={{ marginTop: 3, marginRight: 10, height: 2, backgroundColor: $colors.main }} />
    </View>
  )
}

const styles = StyleSheet.create({
  
})