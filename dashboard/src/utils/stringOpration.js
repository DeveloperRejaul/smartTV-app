/**
 * @param {string} string  receive single word of string;
 * @returns convert this string  first character uppercase
 */
export const stringFirstUp = (string) => string?.charAt(0)?.toUpperCase()
  .concat(string?.slice(1, string?.length));

/**
 * @param {string} text
 * @param {number} num
 * @returns text
 */
export const checkTextLen = (text, num) => {
  if (text?.length >= num) return `${text.slice(0, num)} ...`;
  return text;
};

export const dateFormat = (data) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const [month, day, year] = new Date(data).toLocaleDateString('en-US', options)?.split(' ');
  return `${day.slice(0, -1).padStart(2, 0)} ${month} ${year}`;
};
