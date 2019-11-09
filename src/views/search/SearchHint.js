import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, ScrollView,
  StyleSheet
} from 'react-native'
import Button from '~/components/Button'

SearchHint.propTypes = {
  titles: PropTypes.array,
  onTapTitle: PropTypes.func
}

export default function SearchHint({
  titles,
  onTapTitle  
}){
  return (
    <View style={{ flex: 1 }}>
      {titles ? 
        <ScrollView removeClippedSubviews keyboardShouldPersistTaps="always">{titles.map(title =>
          <Button contentContainerStyle={{}} rippleColor="#ccc" noLimit={false} 
            onPress={() => onTapTitle(title)}
            key={title}
          >
            <View style={styles.title}>
              <Text style={{ color: '#666' }}>{title}</Text>
            </View>
          </Button>
        )}</ScrollView>
      :
        <View style={styles.title}>
          <Text style={{ color: '#666' }}>搜索中...</Text>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    height: 45,
    justifyContent: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  }
})