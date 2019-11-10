export default function(){
  var viewBox = $('#webViewContainer')

  viewBox.find('.music163').each(function(e){
    function createLink(params){
      return 'https://music.163.com/outchain/player?auto=0&' + $.param(params)
    }
    var data = this.dataset
    var id = data.id,
    type = data.type || 2,
    size = data.size || 'big'
    var sizes = [
      { big: 430, small: 90 },
      { big: 430, small: 90 },
      { big: 66, small: 32 },
      { big: 66, small: 32},
      { big: 430, small: 90 }
    ]
    type = parseInt(type)
    var height = sizes[type][size]
    var link = createLink({
      id, type, height
    })
    
    var iframe = $(`<iframe src=${link} seamless frameborder="0" style="width:100%; height:${height+20}px"></iframe>`)
    $(this).append(iframe)
  })
}