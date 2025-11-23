import { format } from "date-fns";
/**
 * Converts a d3.utcFormat pattern to a date-fns format pattern
 * @param {string} d3Format - The d3 format pattern (e.g. "%Y-%m-%d")
 * @returns {string} - The equivalent date-fns format pattern (e.g. "yyyy-MM-dd")
 */
export function d3FormatToDateFns(d3Format: string) {
  // Mapping from d3 directives to date-fns tokens
  const formatMap = {
    // Year
    "%Y": "yyyy", // 4-digit year
    "%y": "yy", // 2-digit year

    // Month
    "%m": "MM", // month as 2-digit number (01-12)
    "%b": "MMM", // abbreviated month name (Jan, Feb, etc)
    "%B": "MMMM", // full month name (January, February, etc)

    // Day
    "%d": "dd", // day of month as 2-digit number (01-31)
    "%e": "d", // day of month (1-31)
    "%a": "EEE", // abbreviated weekday name (Sun, Mon, etc)
    "%A": "EEEE", // full weekday name (Sunday, Monday, etc)
    "%j": "DDD", // day of year (001-366)

    // Hours, Minutes, Seconds
    "%H": "HH", // hour (24-hour, 00-23)
    "%I": "hh", // hour (12-hour, 01-12)
    "%M": "mm", // minute (00-59)
    "%S": "ss", // second (00-59)
    "%L": "SSS", // milliseconds (000-999)
    "%f": "SSSSSS", // ? (000000-999999)
    "%p": "aa", // AM/PM

    // Special
    "%Z": "XXX", // timezone offset
    "%z": "xxx", // timezone numeric offset
    "%%": "%", // literal %
  };

  // Replace all d3 format directives with their date-fns equivalents
  let dateFnsFormat = d3Format;
  Object.entries(formatMap).forEach(([d3Token, dateFnsToken]) => {
    dateFnsFormat = dateFnsFormat.replace(new RegExp(d3Token, "g"), dateFnsToken);
  });

  return dateFnsFormat;
}

/**
 * Creates a formatting function similar to d3.utcFormat but using date-fns
 * @param {string} d3FormatStr - The d3 format pattern (e.g. "%Y-%m-%d")
 * @param {Object} options - Additional options to pass to date-fns format
 * @returns {Function} - A function that takes a Date and returns a formatted string
 */
export function createUtcFormatter(d3FormatStr: string, options = {}) {
  return (date: Date) => format(date, d3FormatToDateFns(d3FormatStr), options);
}
