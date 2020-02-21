import home from './home'

export default [
  home
].map(item => `(${item.toString()})()`).join(';')