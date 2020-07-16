import carousel from './carousel'

const hmoeControlsCodes = [
  carousel, 
].reduce((result, item) => {
  result.script += item.script
  result.styleSheet += item.styleSheet + '\n'
  return result
}, {
  script: '',
  styleSheet: ''
})

export default hmoeControlsCodes