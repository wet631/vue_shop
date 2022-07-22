// 获取到数据
export function getLocal (key) {
  let data = localStorage.getItem(key)
  try {
    data = JSON.parse(data)
  } catch (e) {
    console.log(e)
  }
  return data
}

export function setLocal (key, data) {
  localStorage.set(
    key,
    typeof data === 'object' ? JSON.stringify(data) : data
  )
}
