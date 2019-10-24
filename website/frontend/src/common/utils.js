import { formatRelative } from 'date-fns';
import { zhCN } from 'date-fns/locale';


/**
 * Generates a random ID. If `prefix` is given, the ID is appended to it. Comparing to lodash
 * `uniqueId` function, this function generates a stronger ID with less chance of conflict.
 *
 * See: https://stackoverflow.com/a/2117523
 */
export function randomId(prefix = '') {
  const id = 'xxxxxxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16));
  return `${prefix || ''}${id}`;
}


export function isNonBlankString(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim() !== '';
}


export function convertToPlainText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value !== 'string') {
    return `${value}`;
  }
  // NOTE: To replace ALL occurrences, we need to use a RegExp pattern.
  return value
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/gm, ' ')
    .replace(/&amp;/gm, '&')
    .replace(/&\w+;/gm, ' ')
    .trim();
}


export function truncateChars(value, limit) {
  if (!value) {
    return '';
  }
  if (value.length <= limit) {
    return value;
  }
  return `${value.substring(0, limit)} ...`;
}


export function prettifyDate(dateOrString) {
  let date = null;
  if (typeof dateOrString === 'string') {
    date = new Date(dateOrString);
  } else {
    date = dateOrString;
  }
  return formatRelative(date, new Date(), { locale: zhCN });
}


export default {
  randomId,
  isNonBlankString,
  convertToPlainText,
  truncateChars,
  prettifyDate,
};
