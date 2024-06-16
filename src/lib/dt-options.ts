import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

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
  return format(dt, `MM/dd, HH:mm${withSeconds ? ':ss' : ''}`, { locale: zhTW })
}

export function timePassed(timestamp: string) {
  return Date.parse(timestamp) < Date.now()
}
