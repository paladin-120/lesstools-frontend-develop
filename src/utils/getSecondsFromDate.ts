/**
 * Function description
 *
 * @param {String | Date} date - date in the past
 * @returns returns number of seconds from date in the past till now
 * @example let seconds = getSecondsFromDate("2021-07-05 18:15:20");
 */
export function getSecondsFromDate(date: string | Date) {
  const now = new Date().getTime();
  const from = new Date(date).getTime();
  return Math.round((now - from) / 1000);
}
