/**
 * Function description
 *
 * @param {Number} seconds - number of seconds
 * @returns returns string in format: 102 h 52 m 23 s
 * @example let time = formatTime(255172);
 */
export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const second = Math.floor(seconds - hours * 3600 - minutes * 60);

  return `${hours > 0 ? `${hours} h` : ''} ${minutes > 0 ? `${minutes} m` : ''} ${
    second > 0 ? `${second} s` : ''
  }`;
}

// get timestamp code of the start of current hour
export const getStartOfHour = () => Math.floor(Math.floor(Date.now() / 1000) / 3600) * 3600;
