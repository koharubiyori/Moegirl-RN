import React, { PropsWithChildren } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, StyleProp, ViewStyle } from 'react-native'
import { useTheme, Text } from 'react-native-paper'
import store from '~/mobx'
import useTypedNavigation from '~/hooks/useTypedNavigation'

export interface Props {
  title: string
  imgUrl: string | null
  categories: string[]
  style?: StyleProp<ViewStyle>
  onPress?(): void
  onPressCategory?(categoryName: string): void
}

;(CategoryItem2 as DefaultProps<Props>).defaultProps = {
  
}

function CategoryItem2(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  
  const isNightTheme = store.settings.theme === 'night'
  return (
    <TouchableOpacity style={props.style} onPress={props.onPress}>
      <View style={{ ...styles.container, backgroundColor: theme.colors.surface }}>
        <View style={styles.info}>
          <Text style={{ fontSize: 18, marginBottom: 15 }}>{props.title}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {props.categories.map(item =>
              <TouchableOpacity key={item} onPress={() => props.onPressCategory && props.onPressCategory(item)}>
                <View 
                  key={item} 
                  style={{
                    ...styles.categoryBox,
                    backgroundColor: isNightTheme ? theme.colors.lightBg : theme.colors.primary,
                  }}
                >
                  <Text style={{ color: isNightTheme ? theme.colors.text : 'white', fontSize: 10 }}>{item}</Text>
                </View>  
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {props.imgUrl ? <>
          <Image 
            source={{ uri: props.imgUrl }} 
            // 默认图片在debug版本不会生效
            defaultSource={require('~/assets/images/placeholder.png')} 
            resizeMode="cover" 
            style={{ width: 120, minHeight: 150, borderRadius: 1 }} 
          />
        </> : <>
          {/* 这里无论用哪个颜色都不是特别满意，所以就使用单独的颜色了 */}
          <View style={{ width: 120, minHeight: 150, backgroundColor: isNightTheme ? '#5B5B5B' : '#E2E2E2', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.disabled, fontSize: 18, borderRadius: 1 }}>暂无图片</Text>
          </View>
        </>}
      </View>
    </TouchableOpacity>
  )
}

export default CategoryItem2

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    elevation: 1,
    borderRadius: 1,
    flexDirection: 'row'
  },

  info: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10
  },

  categoryBox: {
    padding: 2.5,
    margin: 2.5,
    borderRadius: 1
  }
})