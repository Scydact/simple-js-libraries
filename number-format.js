/** 
 * Convert a decimal value to a sexagecimal string. 
 * 
 * @param {Number} dec Decimal number to encode.
 * @param {Number} round Number of digits to round to. 
 */
export function dec2sex(dec, round = 0) {
    let x = Math.abs(dec);

    let signChar = (dec < 0) ? '-' : '';

    let minutes = (x - ~~x) * 60;
    let seconds = (minutes - ~~minutes) * 60;
    seconds = parseFloat(seconds.toFixed(round));

    // Verify overflowing status
    // Rounding may cause seconds to be 60!
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes === 60) {
        minutes = 0;
        x++;
    }
    return `${signChar}${~~x}°${~~minutes}'${seconds}'`;
}

/** 
 * Parses a sexagesimal string to its corresponding number. 
 * 
 * @param {str} str Sexagesimal string to parse.
 **/
export function sex2dec(str) {
    const re = /[^\d\w.+-]+/;
    str = str.replace(/ /g, '');

    var sign = 1;
    switch (str[0]) {
        case '-':
            str = str.slice(1);
            sign = -1;
            break;
        case '+':
            str = str.slice(1);
            break;
    }

    const searchResult = str.split(re);
    if (!searchResult.length) return undefined;

    const MULT = 1 / 60;
    let val = 0;
    for (let i = searchResult.length; i--;) {
        val = val * MULT + abs(parseFloat(searchResult[i]));
    }

    return sign * val;
}


const METRIC_PREFIXES = {
    'y': 'yocto',
    'z': 'zepto',
    'a': 'atto',
    'f': 'femto',
    'p': 'pico',
    'n': 'nano',
    'µ': 'micro',
    'm': 'milli',
    '': '',
    'k': 'kilo',
    'M': 'mega',
    'G': 'giga',
    'T': 'tera',
    'P': 'peta',
    'E': 'exa',
    'Z': 'zetta',
    'Y': 'yotta',
}
const METRIC_PREFIXES_S = Object.keys(METRIC_PREFIXES);
const METRIC_PREFIXES_L = Object.values(METRIC_PREFIXES);
/**
 * Formats a number in engineering notation.
 * 
 * Examples: 
 *  - 2 ('Hz') => 2 Hz
 *  - 0.01 ('A') => 10 mA 
 *  - 1.023e-8 ('F') => 10.24 nF
 *  - 3.49243e10 ('bps') => 34.92 Gbps
 *  - 7.34e-36 ('C') => 7.34e-36 C
 * @param {Number} n Number to format
 * @param {String} suffix Suffix to add (Hz, m, s, ...). If falsy, will output in engineering exponent notation (0.01 => 10e-3 instead of the standard 1e-4)
 * @param {Boolean} showTrailingZeros (false) If true, trailing zeroes will always be shown.
 * @param {Number} roundDigits (2) Number of digits to round to.
 * @param {Boolean} useLongPrefixes (false) If true, will use 'milli', 'kilo', 'mega'... intead of 'm', 'k', 'M'.
 * @param {Boolean} useExtendedSet (false) if true, will use extended metric prefixes from exp18 to exp24 ('atto', 'zepto', 'yocto' and 'exa', 'zetta', 'yotta')
 */
export function formatEngineering(n, suffix, options) {
    const factor = Math.floor(Math.log10(Math.abs(n)) / 3);
    const opt = {
        trailingZeros: false,
        round: 2,
        longPrefixes: false,
        extendedSet: false,
        ...options,
    };

    const offset = 8;
    const cap = (opt.extendedSet) ? 8 : 5;
    const prefix = (opt.longPrefixes) ? METRIC_PREFIXES_L : METRIC_PREFIXES_S;

    const num = n / 10 ** (factor * 3);
    const numPart = (opt.trailingZeros) ?
        num.toFixed(opt.round) :
        (Math.round((num + Number.EPSILON) * 10 ** opt.round) / (10 ** opt.round)).toString();
    //parseFloat(num.toFixed(opt.round)).toString();  // This is shorter but ~2x slower
    // This Math.round thing is to avoid floating point errors, where 2+2 = 3.999994

    var selectedSuffix = (Math.abs(factor) > cap || suffix == null) ?
        'e' + (factor * 3).toString() :
        ' ' + prefix[factor + offset];

    if (suffix) selectedSuffix += suffix;

    return numPart + selectedSuffix;
}

/**
 * Parses a engineering format string.
 * Please note, this is case sensitive, 
 * and not SPICE notation (mega is capital M, not MEG nor meg nor m).
 * 
 * @param {string} data Number string to parse
 * @returns {string} Returns the actual number.
 */
export function parseEngineering(data) {
    const comp = typeof data;

    if (comp === 'number') return data;
    const str = data.toString();

    const re = /([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)([yzafpnuµmkMGTPEZY]?)(.*)/;
    const searchResult = str.replace(/ /g, '').match(re);

    if (!searchResult) return parseFloat(str);

    const [fullMatch, num, symbol, extraBits] = searchResult;

    const n = parseFloat(num),
        s = symbol.replace('u', 'µ'),
        e = METRIC_PREFIXES_S.findIndex((e) => e === s);

    if (e === -1) return n;

    const exponent = (e - 8) * 3;
    return n * 10 ** exponent;
}