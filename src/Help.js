import dayjs from 'dayjs'

export default Help = {
  checkPermission: (permissions = [''], permission) => {
    const result = permissions.find((element) => element === permission)
    return Boolean(result)
  },
  displayBoolean(boolean) {
    if (boolean === null) return 'NOT FOUND'
    return boolean ? 'YES' : 'NO'
  },
  displayDate: function (date_string) {
    if (!date_string) return 'NOT FOUND'
    let options = { year: 'numeric', month: 'long', day: 'numeric' }
    let date = new Date(date_string)
    return date.toLocaleDateString('en-us', options).toUpperCase()
  },
  displayDateTime(date_string) {
    if (!date_string) return 'NOT FOUND'
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    let date = new Date(date_string)
    return date.toLocaleTimeString('en-us', options)
  },
  displayDateTimeSimple(date_string) {
    if (!date_string) return 'NOT FOUND'
    let options = { year: 'numeric', month: 'long', day: 'numeric' }
    let date = new Date(date_string)
    return date.toLocaleTimeString('en-us', options)
  },
  displayNumber(number) {
    return number || 'NOT FOUND'
  },
  displayNumberWithComma(number) {
    return number?.toLocaleString() || 'NOT FOUND'
  },
  displayPercentage(value, total) {
    let x = (value / total) * 100
    return x ? `${x?.toFixed(2)}%` : 'NOT FOUND'
  },
  displayTableIndex: (limit, page, index) => {
    return limit * page + index - limit + 1
  },
  displayTags(array = []) {
    if (array?.length === 0) return 'NOT FOUND'
    return array.filter(Boolean).join(', ').toUpperCase()
  },
  displayText(text) {
    return text?.toUpperCase() || 'NOT FOUND'
  },
  findInArray: (arr = [''], str) => {
    const result = arr?.find((element) => element === str)
    return Boolean(result)
  },
  formArray: function (arr) {
    if (arr.length === 0) return null
    return arr
  },
  formDataOrEmptyString: function (data) {
    return data || ''
  },
  formInputDateTime: function (date, time) {
    return date ? dayjs(`${date}T${time}:00`).format('YYYY-MM-DDTHH:mm:ssZ') : null
  },
  formInputDate: function (date) {
    return date ? dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ') : null
  },
  formInputNumber: function (number) {
    if (number === '') return null
    return Number(number.toString()?.replace(',', ''))
  },
  formInputText: function (text) {
    if (text === '') return null
    return text
  },
  formSelect: function (factual) {
    if (factual === 'yes') return true
    else if (factual === 'no') return false
    else if (factual === '') return null
    else return factual
  },
  setBoolean: function (boolean) {
    if (boolean) return true
    return false
  },
  setDate: function (date) {
    if (!date) return ''
    return dayjs(date).format('YYYY-MM-DD')
  },
  setNumber: function (number) {
    if (!number) return ''
    return number
  },
  setSelect: function (select) {
    if (!select) return ''
    return select
  },
  setText: function (text) {
    if (!text) return ''
    return text
  },
  setTime: function (time) {
    if (!time) return ''
    return dayjs(time).format('HH:mm')
  }
}
