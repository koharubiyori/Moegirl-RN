import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView, NativeModules,
  StyleSheet, Dimensions
} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'

CatalogBody.propTypes = {
  immersionMode: PropTypes.bool,
  items: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onTapTitle: PropTypes.func
}

function CatalogBody(props){
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  const titleHeight = props.immersionMode ? { height: 56 } : { height: 56 + statusBarHeight, paddingTop: statusBarHeight }

  return (
    <View style={{ ...styles.container, height: Dimensions.get('window').height }}>
      <View style={{ ...styles.header, ...titleHeight }}>
        <Text style={styles.headerText}>目录</Text>
        <MaterialIcon name="chevron-right" size={40} color="white" style={{ marginRight: 10 }} onPress={props.onClose} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.titles}
      >{
        props.items.filter(item => parseInt(item.level) < 5 && item.level !== '1').map((item, index) => 
          <Button onPress={() => props.onTapTitle(item.anchor)}
            rippleColor="#ccc"
            noLimit={false}
            key={index}
          >
            <Text 
              numberOfLines={1}
              style={{ 
                ...(parseInt(item.level) < 3 ? styles.title : styles.subTitle),
                paddingLeft: (parseInt(item.level) - 2) * 5
              }}
            >{(parseInt(item.level) > 2 ? '- ' : '') + item.line}</Text>
          </Button>
        )
      }</ScrollView>     
    </View>
  )
}

export default CatalogBody

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },

  header: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: $colors.main
  },

  headerText: {
    fontSize: 18,
    color: 'white'
  },

  titles: {
    padding: 10
  },

  title: {
    fontSize: 16,
    color: $colors.main
  },

  subTitle: {
    fontSize: 14,
    color: '#bbb'
  }
})