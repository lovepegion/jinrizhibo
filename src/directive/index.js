import Scroll from './scroll/scroll.js'

Scroll.install = function(Vue) {
  Vue.directive(Scroll.name, Scroll)
}

export { Scroll }