import request from '~/utils/request'

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