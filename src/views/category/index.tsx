import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import searchApi from '~/api/search'
import { SearchByCategoryData } from '~/api/search.d'
import Toolbar from '~/components/Toolbar'
import Item from './components/Item'
import StatusBar from '~/components/StatusBar'

export interface Props {
  
}

export interface RouteParams {
  title: string
  branch?: string[] | null
  articleTitle?: string | null
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

const initCategoryData = (): {
  list: SearchByCategoryData[]
  status: 0 | 1 | 2 | 3 | 4 | 5
  continue: string
} => ({
  list: [],
  status: 1,
  continue: ''
})

function Category(props: PropsWithChildren<FinalProps>) {
  const title = props.navigation.getParam('title')
  const branch = props.navigation.getParam('branch')
  const articleTitle = props.navigation.getParam('articleTitle')
  const [categoryData, setCategoryData] = useState(initCategoryData())
  const refs = {
    categoryBranch: useRef<any>(),
  }

  useEffect(() => {
    search()
    setTimeout(() => refs.categoryBranch.current && refs.categoryBranch.current.scrollToEnd())
  }, [])
  
  const thumbSize = Dimensions.get('window').width * 0.45 * 2
  function search() {
    if ([2, 4, 5].includes(categoryData.status)) { return }

    setCategoryData(prevVal => ({ ...prevVal, status: 2 }))
    searchApi.searchByCategory(title, thumbSize, categoryData.continue)
      .then(data => {
        let nextStatus = 3
        if (!data.query) return setCategoryData(prevVal => ({ ...prevVal, status: 5 }))
        if (categoryData.list.length === 0 && Object.keys(data.query.pages).length === 0) {
          nextStatus = 5
        }
        if (!data.continue) nextStatus = 4

        console.log(data)
        setCategoryData(prevVal => ({
          list: prevVal.list.concat(Object.values(data.query.pages)),
          status: nextStatus as any,
          continue: data.continue ? data.continue.gcmcontinue : ''
        }))
      })
      .catch(e => {
        console.log(e)
        setCategoryData(prevVal => ({ ...prevVal, status: 0 }))
      })
  }

  const currentBranch = branch ? branch.concat([title]) : null
  return (
    <View style={{ flex: 1 }}>
      <StatusBar blackText={false} />
      <Toolbar
        title={'分类:' + title}
        leftIcon="home"
        rightIcon="search"
        onPressLeftIcon={() => props.navigation.popToTop()}
        onPressRightIcon={() => props.navigation.push('search')}
      />

      {branch ? <>
        <ScrollView horizontal style={{ flexDirection: 'row', margin: 10, flexGrow: 0 }} ref={refs.categoryBranch}>
          {currentBranch!.map((categoryName, index) => 
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CategoryBtn 
                isCurrent={index + 1 === currentBranch!.length}
                onPress={() => index + 1 !== currentBranch!.length && props.navigation.push('article', { link: '分类:' + categoryName })}
              >
                {categoryName}
              </CategoryBtn>
              {index !== currentBranch!.length - 1 ? <MaterialIcon name="chevron-right" size={30} color="#ccc" style={{ marginTop: 2 }} /> : null}
            </View>
          )}
        </ScrollView>
      </> : null}

      <FlatList 
        horizontal={false}
        data={categoryData.list} 
        style={{ flex: 1 }}
        numColumns={2}
        columnWrapperStyle={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 }}
        onEndReachedThreshold={0.5}
        onEndReached={search}
        renderItem={item => <Item 
          key={item.item.title}
          title={item.item.title}
          imgUrl={item.item.thumbnail ? item.item.thumbnail.source : null}
          onPress={() => props.navigation.push('article', { link: item.item.title })}
        />}

        ListHeaderComponent={
          articleTitle ? <>
            <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, color: $colors.subtext }}>这个分类对应的条目为：</Text>
              <TouchableOpacity onPress={() => props.navigation.push('article', { link: articleTitle })}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: $colors.primary }}>{articleTitle}</Text>
              </TouchableOpacity>
            </View>
          </> : null
        }

        ListFooterComponent={({
          0: () => 
            <TouchableOpacity onPress={search}>
              <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text>加载失败，点击重试</Text>
              </View>
            </TouchableOpacity>,
          1: () => null,
          2: () => <ActivityIndicator color={$colors.primary} size={50} style={{ marginVertical: 10 }} />,
          3: () => null,
          4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>已经没有啦</Text>,
          5: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>该分类下没有条目</Text>
        }[categoryData.status])()}
      />
    </View>
  )
}

export default Category

const styles = StyleSheet.create({
  title: {
    color: $colors.primary,
    fontSize: 18,
    margin: 10
  },

  categoryBtn: {
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    marginTop: 3,
    backgroundColor: $colors.primary,
    borderRadius: 20,
  },
})

interface TitleProps {
  children: string
}
function Title(props: TitleProps) {
  return (
    <View style={{ margin: 10 }}>
      <Text style={{ fontSize: 18, color: $colors.primary }}>{props.children}</Text>
      <View style={{ height: 2, backgroundColor: $colors.primary }} />
    </View>
  )
}

interface CategoryBtnProps {
  isCurrent: boolean
  children: string
  onPress (): void
}
function CategoryBtn(props: CategoryBtnProps) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ ...styles.categoryBtn, backgroundColor: props.isCurrent ? $colors.accent : $colors.primary }}>
        <Text style={{ fontSize: 16, color: 'white' }}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  )
}