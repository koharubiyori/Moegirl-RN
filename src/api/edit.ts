import request from '~/utils/moeRequest'
import { ApiData } from './edit.d'

function getCode(pageName: string, section: number) {
  return request<ApiData.GetCode>({
    params: {
      action: 'parse',
      page: pageName,
      prop: 'wikitext',
      ...(section ? { section } : {}),
    }
  })
}

function getPreview(codes: string, title: string) {
  return request<ApiData.GetPreview>({
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
  return request<ApiData.GetLastTimestamp>({
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
  return request<ApiData.GetToken>({
    method: 'post',
    params: {
      action: 'query',
      meta: 'tokens'
    }
  })
}

function _editArticle(title: string, section: number, content: string, summary: string, timestamp: string, token: string) {
  return request<ApiData.EditArticle>({
    method: 'post',
    params: {
      action: 'edit',
      title,
      ...(section ? { section } : {}),
      text: content,
      summary,
      minor: 1,
      basetimestamp: timestamp,
      token      
    }
  })
}

async function editArticle(title: string, section: number, content: string, summary: string) {
  try {
    const timestampData = await getLastTimestamp(title)
    const { timestamp } = Object.values(timestampData.query.pages)[0].revisions[0]

    const tokenData = await getToken()
    const token = tokenData.query.tokens.csrftoken

    const result = await _editArticle(title, section, content, summary, timestamp, token)

    if ('error' in result) {
      return Promise.reject(result.error!.code)
    } else {
      return Promise.resolve()
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

const editApi = { getCode, getPreview, getLastTimestamp, getToken, editArticle }
export default editApi