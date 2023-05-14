export function parseQueryDate(
  date: Date | undefined | string
): Date | undefined {
  if (!date) {
    return
  }

  if (typeof date === 'string') {
    const [dateOnly] = date.split('T')
    return new Date(dateOnly)
  }

  return new Date(date)
}
