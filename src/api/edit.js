import request from '~/utils/request'

export function getCode(page, section){
  return request({
    params: {
      action: 'parse',
      page,
      prop: 'wikitext',
      ...(section ? { section } : {}),
    }
  })
}

export function getPreview(codes, title){
  return request({
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

function getLastTimestamp(title){
  return request({
    params: {
      action: 'query',
      prop: 'revisions',
      titles: title,
      rvprop: 'timestamp',
      rvlimit: 1
    }
  })
}

function getToken(){
  return request({
    method: 'post',
    params: {
      action: 'query',
      meta: 'tokens'
    }
  })
}

function _editArticle(title, section, content, summary, timestamp, token){
  return request({
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

export async function editArticle(title, section, content, summary){
  try{
    const timestampData = await getLastTimestamp(title)
    const {timestamp} = Object.values(timestampData.query.pages)[0].revisions[0]

    const tokenData = await getToken()
    const token = tokenData.query.tokens.csrftoken

    const result = await _editArticle(title, section, content, summary, timestamp, token)

    if('error' in result){
      return Promise.reject(data.error.code)
    }else{
      return Promise.resolve()
    }
  }catch(e){
    return Promise.reject(e)
  }
}