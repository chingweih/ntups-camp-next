import { formatInTimeZone as format } from 'date-fns-tz'

export const dtOptions = {
  month: '2-digit' as const,
  day: '2-digit' as const,
  hour: '2-digit' as const,
  minute: '2-digit' as const,
  timeZone: 'Asia/Taipei',
}

export const locale = 'en-US'

export function getDateString(
  timestamp?: string,
  withSeconds: boolean = false,
) {
  const dt = timestamp ? new Date(timestamp) : new Date()
  return format(dt, 'Asia/Taipei', `MM/dd HH:mm${withSeconds ? ':ss' : ''}`)
}

export function timePassed(timestamp: string) {
  return Date.parse(timestamp) < Date.now()
}
