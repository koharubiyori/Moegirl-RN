import React, { PropsWithChildren, useState, useMemo, useRef, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import ViewContainer from '~/components/ViewContainer'
import { useTheme, Text } from 'react-native-paper'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import useMyRoute from '~/hooks/useTypedRoute'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import store from '~/mobx'
import CommentEditor from '../../components/Editor'
import CommentItem, { CommentItemRef } from '../../components/Item'
import { useObserver } from 'mobx-react-lite'
import { useLayoutAnimationInMobx } from '~/hooks/useLayoutAnimation'
import { CommentTreeData, CommentTreeDataWithTarget } from '~/utils/commentTree'
import { MobxCommentTree } from '~/mobx/comment'
import i from './lang'

export interface Props {
  
}

export interface RouteParams {
  pageId: number
  commentId: string
}

function CommentReplyPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const [visibleEditor, setVisibleEditor] = useState(false)
  const [commentTargetId, setCommentTargetId] = useState('')
  const refs = {
    list: useRef<any>(),
    commentItems: useRef<{ [commentId: string]: CommentItemRef }>({})
  }
  
  const commentData = useMemo(() => store.comment.findByCommentId(route.params.pageId, route.params.commentId)!, [])

  // 点击回复项上的人名时，跳转到对应评论
  function scrollToItem(item: CommentTreeDataWithTarget) {
    refs.list.current.scrollToItem({ item: (item as any).target })
    refs.commentItems.current[item.target!.id].showBgColor()
  }

  return useObserver(() => {
    useLayoutAnimationInMobx()

    return (
      <ViewContainer grayBgColor>
        <MyStatusBar />
        <MyToolbar
          title={i.index.title(commentData.username)}
          leftIcon="keyboard-backspace"
          rightIcon="add"
          onPressLeftIcon={navigation.goBack}
          onPressRightIcon={() => setVisibleEditor(true)}
        />

        <CommentEditor 
          visible={visibleEditor} 
          pageId={route.params.pageId} 
          targetId={commentTargetId || route.params.commentId}
          onPosted={() => { setVisibleEditor(false); setCommentTargetId('') }} 
          onDismiss={() => { setVisibleEditor(false); setCommentTargetId('') }}
        />
        
        <FlatList removeClippedSubviews 
          ref={refs.list}
          style={{ flex: 1 }}
          data={commentData.children!.reverse()} 
          onEndReachedThreshold={0.5}
          initialNumToRender={4}
          onEndReached={() => store.comment.loadNext(route.params.pageId)}
          renderItem={item => 
            <CommentItem isReply
              key={item.item.id}
              getRefFn={ref => refs.commentItems.current[item.item.id] = ref}
              pageId={route.params.pageId}
              rootCommentId={route.params.commentId}
              visibleReply={false} 
              visibleReplyNum={false}
              commentData={item.item}
              onPressReply={targetId => { setVisibleEditor(true); setCommentTargetId(targetId) }}
              onPressTargetName={() => scrollToItem(item.item)}
            />
          }

          ListHeaderComponent={
            <>
              <CommentItem isReply 
                commentData={commentData} 
                pageId={route.params.pageId}
                visibleReply={false} 
                visibleReplyBtn={false} 
                visibleDelBtn={false} 
              />
              {commentData.children!.length !== 0 && 
                <Text style={{ fontSize: 18, marginLeft: 20, color: theme.colors.disabled, marginVertical: 10 }}>{i.index.count(commentData.children!.length)}</Text>
              }
            </>
          }

          ListFooterComponent={
            <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>
              {commentData.children!.length === 0 ? i.index.noData : i.index.allLoaded}
            </Text>
          }
        />
      </ViewContainer>
    )
  })
}

export default CommentReplyPage

const styles = StyleSheet.create({
  
})