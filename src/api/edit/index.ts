import moeRequest from '~/request/moegirl'
import request from '~/request/base'
import { EditApiData } from './types'
import articleApi from '../article'

async function getCode(pageName: string, section?: number) {
  const translatedTitle = await articleApi.translateTitle(pageName)
  
  return moeRequest<EditApiData.GetCode>({
    params: {
      action: 'parse',
      page: translatedTitle,
      prop: 'wikitext',
      ...(section ? { section } : {}),
    }
  })
}

function getPreview(codes: string, title: string) {
  return moeRequest<EditApiData.GetPreview>({
    method: 'post',
    params: {
      action: 'parse',
      text: codes,
      prop: 'text',
      title,
      preview: 1,
      sectionpreview: 1,
      contentmodel: 'wikitext'
    }
  })
}

async function getLastTimestamp(title: string) {
  const translatedTitle = await articleApi.translateTitle(title)
  return moeRequest<EditApiData.GetLastTimestamp>({
    params: {
      action: 'query',
      prop: 'revisions',
      titles: translatedTitle,
      rvprop: 'timestamp',
      rvlimit: 1
    }
  })
}

function getToken() {
  return moeRequest<EditApiData.GetToken>({
    method: 'post',
    params: {
      action: 'query',
      meta: 'tokens'
    }
  })
}

async function executeEditArticle({
  token, title, section, content, summary, timestamp, captchaword, captchaid
}: {
  token: string,
  title: string, 
  section: number | string | undefined, 
  content: string, 
  summary: string, 
  timestamp: string | undefined, 
  captchaid?: string,
  captchaword?: string
}) {
  const translatedTitle = await articleApi.translateTitle(title)
  return moeRequest<EditApiData.EditArticle>({
    method: 'post',
    params: {
      action: 'edit',
      tags: 'Android App Edit',
      minor: 1,
      title: translatedTitle,
      text: content,
      summary,
      ...(section ? { section } : {}),
      ...(timestamp ? { basetimestamp: timestamp } : {}),
      ...(captchaid ? { captchaid } : {}),
      ...(captchaword ? { captchaword } : {}),
      token      
    }
  })
}

let retryMark = false // 对所有请求执行一次失败后重试，以跳过所有警告
async function editArticle({
  title, section, content, summary, captchaid, captchaword
}: {
  title: string
  section: number | string | undefined
  content: string
  summary: string
  captchaid?: string
  captchaword?: string
}): Promise<void> {
  try {
    const timestampData = await getLastTimestamp(title)
    let timestamp: string | undefined

    // 尝试获取不存在的页面的时间戳数据，里面没有revisions字段
    if (Object.values(timestampData.query.pages)[0].revisions) {
      timestamp = Object.values(timestampData.query.pages)[0].revisions[0].timestamp
    }

    const tokenData = await getToken()
    const token = tokenData.query.tokens.csrftoken

    const result = await executeEditArticle({ token, title, section, content, summary, timestamp, captchaid, captchaword })

    if ('error' in result) {
      if (!retryMark) {
        retryMark = true
        return editArticle({ title, section, content, summary, captchaid, captchaword })
      } else {
        retryMark = false
        return Promise.reject(result.error!.code)
      }
    } else {
      retryMark = false
      return Promise.resolve()
    }
  } catch (e) {
    
    return Promise.reject(e)
  }
}

function getCaptcha() {
  const captchaBaseUrl = 'https://mmixlaxtpscprd.moegirlpedia.moetransit.com/image/Retrieval?id='
  return request({
    baseURL: 'https://mmixlaxtpscprd.moegirlpedia.moetransit.com/questionEntry/BeginChallenge',
    params: {
      expectedLang: 'zh-CN'
    }
  })
    .then(rawData => {
      const data: EditApiData.GetCaptcha = rawData.data
      return {
        ...data,
        path: captchaBaseUrl + data.path
      }
    }) as Promise<EditApiData.GetCaptcha>
}

const editApi = { getCode, getPreview, getLastTimestamp, getToken, editArticle, getCaptcha }
export default editApi