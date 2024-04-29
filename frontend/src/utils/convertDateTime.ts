export const convertDateTime = (inputDateTime) => {
  const dateObject = new Date(inputDateTime)

  const hours = dateObject.getUTCHours()
  const minutes = dateObject.getUTCMinutes()
  const day = dateObject.getUTCDate()
  const month = dateObject.getUTCMonth() + 1
  const year = dateObject.getUTCFullYear()

  const formattedTime = `${hours}h${minutes.toString().padStart(2, '0')}'`

  const formattedDate = `${day.toString().padStart(2, '0')}.${month
    .toString()
    .padStart(2, '0')}.${year}`

  const outputDateTime = `${formattedTime} • ${formattedDate}`

  return outputDateTime
}
