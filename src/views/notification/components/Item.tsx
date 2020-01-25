import React, { useState, useEffect, useRef, PropsWithChildren, FC } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { NotificationData } from '~/api/notification.d'
import Button from '~/components/Button'

export interface Props {
  notificationData: NotificationData
  onPress (): void
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
    let words = html.split(/<(b|strong)>.+?<\/(b|strong)>/g).filter(word => !['b', 'strong'].includes(word)) // 以加粗标签作为分隔符，并剔除捕获组的内容
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
    <Button style={styles.container} onPress={props.onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <Image source={{ uri: $avatarUrl + props.notificationData.agent.name }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text >{strongTagToRnBoldText(props.notificationData['*'].header)}</Text>
          <Text style={{ marginTop: 5, color: '#ABABAB' }} numberOfLines={2}>{props.notificationData['*'].body || props.notificationData['*'].compactHeader}</Text>
        </View>
      </View>
    </Button>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
    paddingHorizontal: 5,
    backgroundColor: 'white'
  },

  avatar: {
    width: 55, 
    height: 55, 
    marginRight: 10,
    borderRadius: 30,
  }
})