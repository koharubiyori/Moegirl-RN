import moeRequest from '~/request/moegirl'
import { NotificationApiData } from './types'

export function get(continueMark: string | null = null, limit = 50) {
  return moeRequest<NotificationApiData.Get>({
    // 这里有些参数文档里没写，只好直接抄页面请求
    params: {
      action: 'query',
      meta: 'notifications',
      notunreadfirst: 1,
      notalertunreadfirst: 1,
      formatversion: 2,
      notlimit: limit,
      notprop: 'list|count',
      notsections: 'message|alert',
      notformat: 'model',
      notcrosswikisummary: 1,
      ...(continueMark ? { notcontinue: continueMark } : {})
    }
  })
}

function getToken () {
  return moeRequest<NotificationApiData.GetToken>({
    method: 'post',
    params: {
      action: 'query',
      meta: 'tokens'
    }
  })
}

function _checkAll(token: string) {
  return moeRequest<NotificationApiData.CheckAll>({
    method: 'post',
    params: {
      action: 'echomarkread',
      all: 1,
      token
    }
  })
}

async function markReadAll() {
  try {
    const tokenData = await getToken()
    const result = await _checkAll(tokenData.query.tokens.csrftoken)

    return result.query.echomarkread.result === 'success'
  } catch (e) {
    return Promise.reject(e)
  }
}

const notificationApi = { get, getToken, markReadAll }
export default notificationApi