import { useObserver } from 'mobx-react-lite'
import React, { PropsWithChildren, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import MyActivityIndicator from '~/components/MyActivityIndicator'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation, { useLayoutAnimationInMobx } from '~/hooks/useLayoutAnimation'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import useMyRoute from '~/hooks/useTypedRoute'
import store from '~/mobx'
import CommentEditor from './components/Editor'
import CommentItem from './components/Item'
import i from './lang'

export interface Props {
  
}

export interface RouteParams {
  pageName: string
  pageId: number
}

function CommentPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const [visibleEditor, setVisibleEditor] = useState(false)
  const [commentTargetId, setCommentTargetId] = useState('')

  useLayoutAnimation()

  function addComment() {
    setVisibleEditor(true)
  }

  return useObserver(() => {
    useLayoutAnimationInMobx()
    
    const commentData = store.comment.data[route.params.pageId]

    return (
      <ViewContainer grayBgColor>
        <MyStatusBar />
        <MyToolbar
          title={route.params.pageName}
          leftIcon="keyboard-backspace"
          rightIcon="add"
          onPressLeftIcon={navigation.goBack}
          onPressRightIcon={addComment}
        />

        <CommentEditor 
          visible={visibleEditor} 
          pageId={route.params.pageId} 
          targetId={commentTargetId}
          onPosted={() => { setVisibleEditor(false); setCommentTargetId('') }} 
          onDismiss={() => { setVisibleEditor(false); setCommentTargetId('') }}
        />

        <FlatList removeClippedSubviews 
          style={{ flex: 1 }}
          data={commentData.commentTree} 
          onEndReachedThreshold={1}
          initialNumToRender={4}
          onEndReached={() => store.comment.loadNext(route.params.pageId)}
          renderItem={item =>
            <CommentItem 
              key={item.item.id} 
              commentData={item.item}
              pageId={route.params.pageId}
              onPressReply={targetId => { setVisibleEditor(true); setCommentTargetId(targetId) }}
            />
          }

          refreshControl={
            <RefreshControl 
              colors={[theme.colors.accent]} 
              onRefresh={() => store.comment.refresh(route.params.pageId)} 
              refreshing={commentData.status === 2.1} 
            />
          }

          ListHeaderComponent={commentData.popular.length !== 0 ? <>
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 18, marginLeft: 20, color: theme.colors.disabled, marginBottom: 10 }}>{i.index.popular}</Text>
              {commentData.popular.map(item =>
                <CommentItem 
                  key={item.id} 
                  commentData={item as any} 
                  pageId={route.params.pageId}
                  visibleReply={false} 
                  visibleReplyBtn={false} 
                />  
              )}
              <Text style={{ fontSize: 18, marginLeft: 20, color: theme.colors.disabled, marginTop: 10 }}>{i.index.count(commentData.count)}</Text>
            </View>
          </> : null}

          ListFooterComponent={(({
            0: () => 
              <TouchableOpacity onPress={() => store.comment.loadNext(route.params.pageId)}>
                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                  <Text>{i.index.netErr}</Text>
                </View>
              </TouchableOpacity>,

            2: () => <MyActivityIndicator style={{ marginVertical: 10 }} />,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>{i.index.allLoaded}</Text>,
            5: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>{i.index.noData}</Text>
          } as { [status: number]: () => JSX.Element | null })[commentData.status] || (() => {}))()}
        />
      </ViewContainer>
    )
  })
}

export default CommentPage

const styles = StyleSheet.create({
  
})