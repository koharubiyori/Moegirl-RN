import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, Image, TouchableOpacity,
  StyleSheet
} from 'react-native'

ArticleGroup.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  articles: PropTypes.array,
  style: PropTypes.object,
  navigation: PropTypes.object
}

export default function ArticleGroup({
  title, icon, articles, style, navigation
}){
  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.header}>
        {icon}
        <Text style={{ marginLeft: 10 }}>{title}</Text>
      </View>

      <View>{articles.map(item =>
        <TouchableOpacity onPress={() => navigation.push('article', { link: item.title })} key={item.title}>
          <View style={styles.item}>
            <Image source={item.image ? { uri: item.image } : require('~/assets/images/moemoji.png')} style={{ width: 60, height: 65 }} />
            <Text style={{ textAlign: 'center', flex: 1 }} numberOfLines={2}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 3
  },

  header: {
    height: 50,
    paddingHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },

  item: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  }
})