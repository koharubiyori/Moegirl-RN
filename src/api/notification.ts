import request from '~/utils/moeRequest'
import { NotificationApiData } from './notification.d'

export function get() {
  return request<NotificationApiData.Get>({
    params: {
      action: 'query',
      meta: 'notifications',
      notunreadfirst: true
    }
  })
}

const notificationApi = { get }
export default notificationApi