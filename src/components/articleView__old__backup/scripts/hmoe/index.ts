import home from './homeTrim'

export default [
  home
].map(item => `(${item.toString()})()`).join(';')