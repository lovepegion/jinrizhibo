const lang = [
    '【普通话】',
    '【英语】',
    '【台湾话】',
    '【东北话】',
    '【四川话】',
    '【陕西话】',
    '【广东话】',
    '【湖南话】',
    '【河南话】',
    '【山东话】',
    '【湖北话】',
    '【安徽合肥话】',
    '【内蒙古方言】',
    '【德语】',
    '【法语】',
    '【印地语】',
    '【意大利语】',
    '【日语】',
    '【韩语】',
    '【西班牙语】',
    '【俄语】',
    '【泰语】'
]
function calcText(text) {
    let arr1 = text.split('【')
    let result = []
    arr1.forEach(el => {
        if (el !== '') {
            let arr2 = el.split('】')
            if (arr2 && arr2.length > 1) {
                let key = '【' + arr2[0] + '】'
                let content = arr2[1]
                if (lang.includes(key)) {
                    let item = {
                        'key': key,
                        'content': content
                    }
                    result.push(item)
                }
            }
        }
    })
    return result
}
export default calcText