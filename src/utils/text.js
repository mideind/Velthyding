export const decodeHTML = (str) =>
  str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
