import React, { useState, useEffect, useRef, PropsWithChildren, FC } from 'react'
import { View, Text, StyleSheet, Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native'
import { NotificationData } from '~/api/notification.d'
import format from '~/views/comment/utils/format'

export interface Props {
  notificationData: NotificationData
  onPress?(): void
  onPressAvatar?(username: string): void
}

type FinalProps = Props

function NotificationItem(props: PropsWithChildren<FinalProps>) {
  
  // const NotificationContent = ({
  //   'edit-thank': () => <Text>对你在
  //     <Text style={{ fontWeight: 'bold' }}>{props.notificationData.title.full}</Text>
  //     的编辑表示了感谢。
  //   </Text>,

  //   'edit-user-talk': () => <Text>在你的讨论页留言了。</Text>,

  //   mention: () => <Text>在
  //     <Text style={{ fontWeight: 'bold' }}>{props.notificationData.title.full}</Text>
  //     提到了你。
  //   </Text>,

  //   reverted: () => <Text>将你在
  //     <Text style={{ fontWeight: 'bold' }}>{props.notificationData.title.full}</Text>
  //     的编辑撤销了。
  //   </Text>,

  //   flowthread_delete: () => <Text>你在
  //     <Text style={{ fontWeight: 'bold' }}>{props.notificationData.title.full}</Text>
  //     的评论被删除了。
  //   </Text>,

  //   flowthread_reply: () => <Text>回复了你在
  //     <Text style={{ fontWeight: 'bold' }}>{props.notificationData.title.full}</Text>
  //     的评论。
  //   </Text>,

  //   flowthread_userpage: () => <Text>在
  //     <Text style={{ fontWeight: 'bold' }}>你的用户页</Text>
  //     留言了。
  //   </Text>,

  //   flowthread_spam: () => <Text>你在
  //     <Text style={{ fontWeight: 'bold' }}>{props.notificationData.title.full}</Text>
  //     的评论被自动标记为垃圾评论。
  //   </Text>,

  //   flowthread_mention: () => <Text>在
  //     <Text style={{ fontWeight: 'bold' }}>{props.notificationData.title.full}</Text>
  //     的评论中提到了你。
  //   </Text>    
  // } as { [Type in NotificationData['type']]: FC<any> })[props.notificationData.type]

  // 拿到的通知文本为html，其中加粗使用的是b和strong标签，这里将其转换为rn标签
  function strongTagToRnBoldText(html: string) {
    let words = html.split(/<(b|strong)>.+?<\/(b|strong)>/).filter(word => !['b', 'strong'].includes(word)) // 以加粗标签作为分隔符，并剔除捕获组的内容
    let strongText: string[] = [] // 再取所有加粗标签中的内容
    html.replace(/<(b|strong)>(.+?)<\/(b|strong)>/g, (s, s1, s2, s3) => {
      strongText.push(s2)
      return s
    })

    // 交叉拼接
    return words.map((word, index) => <Text key={index}>
      <Text>{word}</Text>
      {strongText[index] ? <Text style={{ fontWeight: 'bold' }}>{strongText[index]}</Text> : null}
    </Text>)
  }
  
  return (
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ccc')} onPress={props.onPress}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          {!props.notificationData.read ? <View style={styles.badge} /> : null} 

          <TouchableOpacity onPress={() => props.onPressAvatar && props.onPressAvatar(props.notificationData.agent.name)}>
            <Image source={{ uri: $avatarUrl + props.notificationData.agent.name }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1}>{strongTagToRnBoldText(props.notificationData['*'].header)}</Text>
            <Text style={{ fontSize: 13, marginTop: 5, color: '#ABABAB' }} numberOfLines={2}>{props.notificationData['*'].body || props.notificationData['*'].compactHeader}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ color: '#ABABAB' }}>{format.date(parseInt(props.notificationData.timestamp.unix))}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white'
  },

  avatar: {
    width: 50, 
    height: 50, 
    marginRight: 10,
    borderRadius: 25,
  },

  badge: {
    width: 7,
    height: 7,
    backgroundColor: 'red',
    borderRadius: 3.5,
    position: 'absolute',
    top: 5,
    right: 0
  }
})