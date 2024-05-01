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

  return year + '-' + formattedMonth + '-' + formattedDay
}

export const TimeToUnix = (time) => {
  var date = new Date(time)
  return date.getTime()
}

export const ISOToTime = (timestamp) => {
  var date = new Date(timestamp)

  var year = date.getFullYear()
  var month = ('0' + (date.getMonth() + 1)).slice(-2) // Adding 1 to month because JavaScript months are zero-based
  var day = ('0' + date.getDate()).slice(-2)
  var hour = ('0' + date.getHours()).slice(-2)
  var minute = ('0' + date.getMinutes()).slice(-2)

  var formattedTimestamp =
    year + '-' + month + '-' + day + 'T' + hour + ':' + minute

  return formattedTimestamp
}

export const TimeToISO = (time) => {
  var date = new Date(time)
  return date.toISOString()
}
