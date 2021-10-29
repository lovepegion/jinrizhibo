const SPECIAL_CHARS_REGEXP=/([:\-_]+(.))/g
const MOZ_HACK_REGEXP=/^moz([A-Z])/
const ieVersion = Number(document.documentMode)

export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

export const isFunction = (functionToCheck) => {
  var getType = {}
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}

export const isUndefined = (val)=> {
  return val === void 0
}

export const isDefined = (val) => {
  return val !== undefined && val !== null
}

const camelCase = function(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export const getStyle = ieVersion < 9 ? function(element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'styleFloat'
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100
        } catch (e) {
          return 1.0
        }
      default:
        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null)
    }
  } catch (e) {
    return element.style[styleName]
  }
} : function(element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

export const isScroll = (el, vertical) => {
  const determinedDirection = vertical !== null || vertical !== undefined
  const overflow = determinedDirection
    ? vertical
      ? getStyle(el, 'overflow-y')
      : getStyle(el, 'overflow-x')
    : getStyle(el, 'overflow')

  return overflow.match(/(scroll|auto)/)
}

export const getScrollContainer = (el, vertical) => {
  let parent = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window
    }
    if (isScroll(parent, vertical)) {
      return parent
    }
    parent = parent.parentNode
  }
  return parent
}

// 随机数
export function getRandomString () {
  let str = ''
  let range = 5
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  let arrExp = [7, 9, 10, 5, 1] // 加权因子
  let arrValid = [1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 'a', 'b', 'c', 'y', 'z', 'd', 'e', 'f', 'g', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'X', 'r', 'h', 'i', 'j', 's', 't', 'u', 'v', 'w', 'x'] // 校验码
  let checkNumber
  let sum = 0
  let idx = 0
  for (let i = 0; i < 5; i++) {
    if ((str.substr(i, 1).charCodeAt() >= 97 && (str.substr(i, 1).charCodeAt() <= 122))) {
      sum += parseInt((str.substr(i, 1).charCodeAt() - 96), 10) * arrExp[i]
    } else {
      // 对前5位数字与权值求和
      sum += parseInt(str.substr(i, 1), 10) * arrExp[i]
      // 计算模
    }
  }
  idx = sum % 37
  // 校验码
  checkNumber = arrValid[idx]
  return str + checkNumber
}

//  获取图片或视频宽高
export function getMaterialResolution (info, callback) {
  const reader = new FileReader()
  let width = 0
  let height = 0
  reader.readAsDataURL(info.file)
  reader.onload = function (e) {
    info.file['url'] = e.target.result
    if (info.file.type.includes('image/')) { // 如果是图片，获取图片宽高
      const image = new Image()
      image.src = info.file['url']
      image.onload = function () {
        width = image.width
        height = image.height
        console.log('width, height:', width, height)
        callback(width, height)
      }
    } else if (info.file.type.includes('video/')) { // 如果是视频，获取视频的宽高和时长，只能获取到H264及以上视频编码协议（MPEG-4编码格式也获取不到）
      const videoUrl = URL.createObjectURL(info.file)
      const videoObj = document.createElement('video')
      videoObj.preload = 'metadata'
      videoObj.src = videoUrl
      videoObj.onloadedmetadata = function (evt) {
        URL.revokeObjectURL(videoUrl)
        width = videoObj.videoWidth
        height = videoObj.videoHeight
        callback(width, height)
      }
    }
  }
}