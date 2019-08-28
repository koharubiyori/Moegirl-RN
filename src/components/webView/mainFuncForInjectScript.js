export default function(moduleNames){
  function main(moduleNames){
    try {
      var paths = {}
      moduleNames.forEach(name => paths[name] = name)
  
      window.require.config({ baseUrl: 'js', paths })
      window.require(moduleNames)
  
      window.FastClick.attach(document.querySelector('#webViewContainer'))

    } catch (error) {
      ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: error.toString() }))
    }
  }

  return main.toString() + `;main(${'[' + moduleNames.map(val => `'${val}'`).join(',') + ']'})`
}

