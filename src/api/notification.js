import request from '~/utils/moeRequest'

export function getNotifications(notcontinue){
  return request({
    params: {
      action: 'query',
      meta: 'notifications',
      notunreadfirst: true,
      ...(notcontinue ? { notcontinue } : {})
    }
  })
}