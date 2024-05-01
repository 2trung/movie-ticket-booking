export const UnixToTime = (timestamp) => {
  var date = new Date(timestamp)
  var currentOffset = date.getTimezoneOffset()
  var offsetMilliseconds = currentOffset * 60 * 1000
  var timestampWithOffset = timestamp + offsetMilliseconds
  var gmtOffset = 0
  var gmtTimestamp = timestampWithOffset + gmtOffset
  var gmtDate = new Date(gmtTimestamp)
  var day = gmtDate.getDate()
  var month = gmtDate.getMonth() + 1
  var year = gmtDate.getFullYear()

  var formattedDay = day < 10 ? '0' + day : day
  var formattedMonth = month < 10 ? '0' + month : month

  return formattedDay + '.' + formattedMonth + '.' + year
}

export const TimeToUnix = (time) => {
  var date = new Date(time)
  return date.getTime()
}
