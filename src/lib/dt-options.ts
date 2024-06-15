export const dtOptions = {
  month: '2-digit' as const,
  day: '2-digit' as const,
  hour: '2-digit' as const,
  minute: '2-digit' as const,
  timeZone: 'Asia/Taipei',
}

export const locale = 'en-US'

export function getDateString(timestamp?: string) {
  return timestamp
    ? new Date(timestamp).toLocaleTimeString(locale, dtOptions)
    : new Date().toLocaleTimeString(locale, dtOptions)
}

export function timePassed(timestamp: string) {
  return Date.parse(timestamp) < Date.now()
}
