import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import searchApi from '~/api/search'
import { SearchByCategoryData } from '~/api/search/types'
import MovableHeaderWrapperForList from '~/components/MovableHeaderWrapperForList'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import ViewContainer from '~/components/ViewContainer'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import useMyRoute from '~/hooks/useTypedRoute'
import CategoryItem2 from './components/Item2'
import i from './lang'

export interface Props {
  
}

export interface RouteParams {
  title: string
  branch?: string[] | null
  articleTitle?: string | null
}

const initCategoryData = (): {
  list: SearchByCategoryData[]
  status: 0 | 1 | 2 | 3 | 4 | 5
  continue: string
} => ({
  list: [],
  status: 1,
  continue: ''
})

function CategoryPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const title = route.params.title
  const branch = route.params.branch
  const articleTitle = route.params.articleTitle
  const [categoryData, setCategoryData] = useState(initCategoryData())
  const [categoryBarHeight, setCategoryBarHeight] = useState(0)

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
    <ViewContainer style={{ flex: 1 }}>
      <MyStatusBar color={theme.colors.primary} />
      <MovableHeaderWrapperForList
        maxDistance={56}
        header={<>
          <MyToolbar
            title={i.index.title(title)}
            leftIcon="home"
            rightIcon="search"
            onPressLeftIcon={() => navigation.popToTop()}
            onPressRightIcon={() => navigation.push('search')}
          />

          {branch ? <>
            <ScrollView horizontal 
              style={{ ...styles.branchContainer, backgroundColor: theme.colors.primary }} 
              contentContainerStyle={{ paddingHorizontal: 10 }}
              ref={refs.categoryBranch}
              onLayout={e => setCategoryBarHeight(e.nativeEvent.layout.height)}
            >
              {currentBranch!.map((categoryName, index) => 
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CategoryBtn 
                    isCurrent={index + 1 === currentBranch!.length}
                    onPress={() => index + 1 !== currentBranch!.length && navigation.push('article', { pageName: '分类:' + categoryName, displayPageName: i.index.title(categoryName) })}
                  >{categoryName}</CategoryBtn>
                  {index !== currentBranch!.length - 1 ? <MaterialIcon name="chevron-right" size={30} color={theme.colors.onSurface} style={{ marginTop: 2 }} /> : null}
                </View>
              )}
            </ScrollView>
          </> : null}  
        </>}
      >{(scrollEventMapTo, maxDistance) =>
        <FlatList 
          horizontal={false}
          data={categoryData.list} 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: MyToolbar.height + categoryBarHeight + StatusBar.currentHeight! }}
          onEndReachedThreshold={0.5}
          onEndReached={search}
          onScroll={scrollEventMapTo}
          renderItem={(item: any) => <CategoryItem2
            key={item.item.title}
            style={{ marginTop: 10 }}
            title={item.item.title}
            imgUrl={item.item.thumbnail ? item.item.thumbnail.source : null}
            categories={item.item.categories.map((item: any) => item.title.replace('Category:', ''))}
            onPress={() => navigation.push('article', { pageName: item.item.title })}
            onPressCategory={categoryName => navigation.push('article', { pageName: '分类:' + categoryName, displayPageName: i.index.title(categoryName) })}
          />}

          ListHeaderComponent={
            articleTitle ? <>
              <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                <Text style={{ fontSize: 16, color: theme.colors.placeholder }}>{i.index.categoryPageHint}：</Text>
                <TouchableOpacity onPress={() => navigation.push('article', { pageName: articleTitle })}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.accent }}>{articleTitle}</Text>
                </TouchableOpacity>
              </View>
            </> : null
          }

          ListFooterComponent={({
            0: () => 
              <TouchableOpacity onPress={search}>
                <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>{i.index.netErr}</Text>
                </View>
              </TouchableOpacity>,
            1: () => null,
            2: () => <ActivityIndicator color={theme.colors.accent} size={50} style={{ marginVertical: 10 }} />,
            3: () => null,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>{i.index.allLoaded}</Text>,
            5: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>{i.index.noData}</Text>
          }[categoryData.status])()}
        />
      }</MovableHeaderWrapperForList>    
    </ViewContainer>
  )
}

export default CategoryPage

const styles = StyleSheet.create({
  branchContainer: {
    flexDirection: 'row', 
    flexGrow: 0,
    paddingBottom: 10, 
  },
  
  categoryBtn: {
    paddingHorizontal: 10, 
    marginTop: 2,
  },
})

interface CategoryBtnProps {
  isCurrent: boolean
  children: string
  onPress (): void
}
function CategoryBtn(props: CategoryBtnProps) {
  const theme = useTheme()
  
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ ...styles.categoryBtn, backgroundColor: theme.colors.primary }}>
        <Text style={{ fontSize: 16, color: theme.colors.onSurface }}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  )
}