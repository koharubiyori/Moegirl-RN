import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, Image, TouchableOpacity, ActivityIndicator,
  StyleSheet
} from 'react-native'

ArticleGroup.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.element,
  articles: PropTypes.array,
  style: PropTypes.object,
  navigation: PropTypes.object,
  status: PropTypes.number,
  onTapReload: PropTypes.func
}

export default function ArticleGroup({
  title, subtitle, icon, articles, style, navigation, status, onTapReload
}){
  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.header}>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {icon}
            <Text style={{ marginLeft: 10 }}>{title}</Text>
          </View>

          {!subtitle ? null :
          <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
            <Text style={{ color: '#ABABAB', fontSize: 13 }} numberOfLines={1}>{subtitle}</Text>
          </View>}

          {status === 2 ? <ActivityIndicator color={$colors.main} size={26} style={{ marginLeft: 10 }} /> : null}
        </View>
      </View>

      {status === 3 ?
        <View style={{ marginTop: 10 }}>{articles.map(item =>
          <TouchableOpacity onPress={() => navigation.push('article', { link: item.title })} key={item.title}>
            <View style={styles.item}>
              <Image source={item.image ? { uri: item.image } : require('~/assets/images/moemoji.png')} style={{ width: 60, height: 65, borderRadius: 3 }} />
              <Text style={{ textAlign: 'center', flex: 1 }} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}</View>
      : null}

      {status === 0 ? 
        <TouchableOpacity onPress={onTapReload}>
          <Text style={{ marginVertical: 20, color: $colors.main, textAlign: 'center' }}>重新加载</Text>
        </TouchableOpacity>
      : null}
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
    paddingHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },

  item: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  }
})