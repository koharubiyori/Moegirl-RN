import request from '~/utils/moeRequest'

export function getArticle(name = 'Mainpage'){
  return request({
    params: {
      action: 'parse',
      page: name,
      redirects: 1,
      prop: 'text|categories|templates|sections|images'
    }
  })
}

export function getMainImage(name){
  return request({
    params: {
      action: 'query',
      prop: 'pageimages',
      titles: name,
      pithumbsize: 500
    }
  }).then(data =>{
    var {pages} = data.query
    return Object.values(pages)[0].thumbnail
  })
}

export function getImageUrl(name){
  return request({
    baseURL: 'https://commons.moegirl.org/api.php',
    method: 'post',
    params: {
      action: 'query',
      prop: 'imageinfo',
      titles: 'File:' + name,
      iiprop: 'url'
    }
  }).then(data =>{
    return Object.values(data.query.pages)[0].imageinfo[0].url
  })
}