import request from '~/utils/moeRequest'
import { EditApiData } from './edit.d'

function getCode(pageName: string, section: number | null) {
  return request<EditApiData.GetCode>({
    params: {
      action: 'parse',
      page: pageName,
      prop: 'wikitext',
      ...(section ? { section } : {}),
    }
  })
}

function getPreview(codes: string, title: string) {
  return request<EditApiData.GetPreview>({
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

function getLastTimestamp(title: string) {
  return request<EditApiData.GetLastTimestamp>({
    params: {
      action: 'query',
      prop: 'revisions',
      titles: title,
      rvprop: 'timestamp',
      rvlimit: 1
    }
  })
}

function getToken() {
  return request<EditApiData.GetToken>({
    method: 'post',
    params: {
      action: 'query',
      meta: 'tokens'
    }
  })
}

function _editArticle(title: string, section: number | undefined, content: string, summary: string, timestamp: string | undefined, token: string) {
  return request<EditApiData.EditArticle>({
    method: 'post',
    params: {
      action: 'edit',
      title,
      ...(section ? { section } : {}),
      text: content,
      summary,
      minor: 1,
      ...(timestamp ? { basetimestamp: timestamp } : {}),
      token      
    }
  })
}

let retryMark = false // 对所有请求执行一次失败后重试，以跳过所有警告
async function editArticle(title: string, section: number | undefined, content: string, summary: string): Promise<void> {
  try {
    const timestampData = await getLastTimestamp(title)
    let timestamp: string | undefined

    // 尝试获取不存在的页面的时间戳数据，里面没有revisions字段
    if (Object.values(timestampData.query.pages)[0].revisions) {
      timestamp = Object.values(timestampData.query.pages)[0].revisions[0].timestamp
    }

    const tokenData = await getToken()
    const token = tokenData.query.tokens.csrftoken

    const result = await _editArticle(title, section, content, summary, timestamp, token)

    if ('error' in result) {
      retryMark = false
      return Promise.reject(result.error!.code)
    } else {
      if (!retryMark) {
        retryMark = true
        return editArticle(title, section, content, summary)
      } else {
        retryMark = false
        return Promise.resolve()
      }
    }
  } catch (e) {
    
    return Promise.reject(e)
  }
}

const editApi = { getCode, getPreview, getLastTimestamp, getToken, editArticle }
export default editApi