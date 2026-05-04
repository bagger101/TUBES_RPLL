import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

const JAKARTA_TZ = 'Asia/Jakarta';

export function getNowInJakarta(): Date {
  return toZonedTime(new Date(), JAKARTA_TZ);
}

export function getAttendanceDateInJakarta(date: Date = new Date()): string {
  const jakartaTime = toZonedTime(date, JAKARTA_TZ);
  if (jakartaTime.getHours() < 6) {
    jakartaTime.setDate(jakartaTime.getDate() - 1);
  }

  return format(jakartaTime, 'yyyy-MM-dd');
}

export function getHourInJakarta(date: Date = new Date()): number {
  const jakartaTime = toZonedTime(date, JAKARTA_TZ);
  return jakartaTime.getHours();
}

export function getMinuteInJakarta(date: Date = new Date()): number {
  const jakartaTime = toZonedTime(date, JAKARTA_TZ);
  return jakartaTime.getMinutes();
}

export function isAfter10AM(date: Date = new Date()): boolean {
  const hour = getHourInJakarta(date);
  return hour >= 10; // 10 AM = 10:00 in 24-hour format
}

export function formatDateJakarta(date: Date = new Date(), dateFormat = 'dd MMM yyyy HH:mm:ss'): string {
  return formatInTimeZone(date, JAKARTA_TZ, dateFormat);
}
