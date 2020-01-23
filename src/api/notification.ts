import request from '~/utils/moeRequest'
import { ApiData } from './notification.d'

export function get() {
  return request<ApiData.Get>({
    params: {
      action: 'query',
      meta: 'notifications',
      notunreadfirst: true
    }
  })
}

const notificationApi = { get }
export default notificationApi