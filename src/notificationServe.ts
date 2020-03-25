import PushNotification from 'react-native-push-notification'

export type NotificationTag = 'awaitNotification'

export function pushMessage(message: string, tag: NotificationTag) {
  PushNotification.localNotification({ 
    message, 
    tag,
  })
}

PushNotification.configure({
  onNotification(notification) {
    const tag: NotificationTag = (notification as any).tag
    if (tag === 'awaitNotification') {
      $appNavigator.navigate('notifications')
    }
  },
  
  requestPermissions: true
})
