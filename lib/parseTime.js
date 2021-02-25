export function parseTime(timeString) {
  const hours = parseInt(timeString.slice(0, 2), 10)
  const minutes = parseInt(timeString.slice(3, 5), 10)

  return `${hours > 12 ? hours - 12 : hours}${minutes ? `:${minutes}` : ''} ${
    hours >= 12 ? 'pm' : 'am'
  }`
}
