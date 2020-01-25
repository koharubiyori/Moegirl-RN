import request from '~/utils/moeRequest'
import { NotificationApiData } from './notification.d'

export function get(checked = true, continueFlag = '') {
  return request<NotificationApiData.Get>({
    // 这里有些参数文档里没写，只好直接抄页面请求
    params: {
      action: 'query',
      meta: 'notifications',
      notunreadfirst: true,
      formatversion: 2,
      notlimit: 50,
      notprop: 'list|count',
      notsections: 'message|alert',
      notformat: 'model',
      notcrosswikisummary: 1,
      notfilter: checked ? 'read' : '!read',
      ...(continueFlag ? { notcontinue: continueFlag } : {})
    }
  })
}
const notificationApi = { get }
export default notificationApi