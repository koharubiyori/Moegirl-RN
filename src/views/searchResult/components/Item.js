import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'

SearchResultItem.propTypes = {
  data: PropTypes.object
}

export default function SearchResultItem({
  data
}){
  function contentBuilder(content){
    return content.split('<span class="searchmatch">').map(section =>{
      var [strong, plain] = section.split('</span>')
      return <Text>
        <Text style={{ backgroundColor: $colors.light }}>{strong}</Text>
        {plain}
      </Text>
    })
  }

  console.log(data)
  return (
    <View style={{ padding: 5, margin: 5 }}>
      <View>
        <Text>{data.title}</Text>
      </View>

      <View style={styles.content}>{contentBuilder(data.snippet)}</View>

      <View style={styles.footer}>
        <Text>最后更新于：{data.timestamp.split('T')[0]}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {

  },

  content: {

  },

  footer: {

  }
})