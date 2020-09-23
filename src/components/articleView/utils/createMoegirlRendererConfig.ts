interface Params {
  pageName?: string
  categories?: string[]
}

export default function createMoegirlRendererConfig(params: Params) {
  const categories = params.categories || []
  
  return `
    moegirl.data.pageName = '${params.pageName}'

    moegirl.config.link.onClick = (data) => _postRnMessage('link', data)
    moegirl.config.biliPlayer.onClick = (data) => _postRnMessage('biliPlayer', data)
    moegirl.config.biliPlayer.onLongPress = (data) => _postRnMessage('biliPlayerLongPress', data)
    moegirl.config.request.onRequested = (data) => _postRnMessage('request', data)
    moegirl.config.vibrate.onCalled = () => _postRnMessage('vibrate')
    moegirl.config.addCategories.categories = ${JSON.stringify(categories)}

    moegirl.init()
  `
}