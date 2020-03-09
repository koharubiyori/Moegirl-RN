import React, { PropsWithChildren } from 'react'
import { Image, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { NotificationData } from '~/api/notification.d'
import toViewDate from '~/utils/toViewDate'

export interface Props {
  notificationData: NotificationData
  onPress?(): void
  onPressAvatar?(username: string): void
}

type FinalProps = Props

function NotificationItem(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
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
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(theme.colors.primary)} onPress={props.onPress}>
      <View style={{ ...styles.container, backgroundColor: theme.colors.surface }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          {!props.notificationData.read ? <View style={styles.badge} /> : null} 

          <TouchableOpacity onPress={() => props.onPressAvatar && props.onPressAvatar(props.notificationData.agent.name)}>
            <Image source={{ uri: $avatarUrl + props.notificationData.agent.name }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1}>{strongTagToRnBoldText(props.notificationData['*'].header)}</Text>
            <Text style={{ fontSize: 13, marginTop: 5, color: theme.colors.placeholder }}>
              {props.notificationData['*'].body || props.notificationData['*'].compactHeader}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ color: theme.colors.placeholder }}>{toViewDate(new Date((props.notificationData.timestamp.unix as any as number) * 1000))}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
    paddingVertical: 5,
    paddingHorizontal: 10
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