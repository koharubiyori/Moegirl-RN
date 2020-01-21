export default function() {
  let viewBox = $('#webViewContainer')

  viewBox.find('.music163').each(function(e) {
    function createLink(params: object) {
      return 'https://music.163.com/outchain/player?auto=0&' + $.param(params)
    }
    let data = this.dataset
    let id = data.id
    let type: string | number = data.type || '2'
    let size: 'big' | 'small' = (data.size || 'big') as any
    let sizes = [
      { big: 430, small: 90 },
      { big: 430, small: 90 },
      { big: 66, small: 32 },
      { big: 66, small: 32 },
      { big: 430, small: 90 }
    ]

    type = parseInt(type!)
    let height = sizes[type][size]
    let link = createLink({
      id, type, height
    })
    
    let iframe = $(`<iframe src=${link} seamless frameborder="0" style="width:100%; height:${height + 20}px"></iframe>`)
    $(this).append(iframe)
  })
}