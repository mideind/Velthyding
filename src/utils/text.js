// eslint-disable-next-line import/prefer-default-export
export const decodeHTML = (str) =>
  str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
