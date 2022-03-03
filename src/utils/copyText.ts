/**
 * Function description
 *
 * @param {String} string - string to be copied
 * @returns returns Promise
 * @example copyText("0x0gdfgdfgjdf0").then(() => console.log("success"));
 */
export function copyText(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
