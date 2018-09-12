'use strict';

const toString = Object.prototype.toString;

function isJSON(obj) {
  return toString.call(obj) === '[object Object]';
}

/**
 * @since 0.0.1
 *
 * @description get own(enumerable and non-enumerable) keys of an object, the same as `Reflect.ownKeys` in es6 spec.
 *
 * @param  {Object} obj
 * @return {Array}
 */
function ownKeys(obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
};

/**
 * @since 0.0.1
 *
 * @description Assign specific enumerable own properties of source object to target object.
 * perform the same as `Object.assign(a, b)`.
 *
 * @param  {Object} tarObj - target object.
 * @param  {Object} srcObj - source object.
 * @param  {Array[]|String[]} range - The keys to assign (and convert).
 * @param  {String} range[].0 - The key of source object.
 * @param  {String} [range[].1] - The key of target object.
 * @param  {Function} [range[].2] - The function to convert source attribute value.
 * @return {Object} tarObj - target object after being assigned specific attributes.
 *
 * @example
 * const symbol = Symbol('c');
 * const tar = {};
 * const src = {
 *   a: 123,
 *   b: 'abc',
 *   [symbol]: true
 * };
 * const obj = assignWithin(tar, src, [
 *   'a',
 *   ['b', 'x', v => v.toUpperCase()],
 *   [symbol, 'c'],
 * ]);
 * // assert
 * assert(obj === tar);
 * assert(obj.a === 123);
 * assert(obj.x === 'ABC');
 * assert(obj.c === true);
 * assert(!('b' in obj));
 *
 */
function assignWithin(tarObj, srcObj, range) {
  if (tarObj == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  if (srcObj != null && Array.isArray(range)) {
    for (const key of range) {
      const [srcKey, tarKey, converter] = Array.isArray(key) ? key : [key, key];
      const desc = Object.getOwnPropertyDescriptor(srcObj, srcKey);
      if (desc && desc.enumerable && tarKey != null) {
        tarObj[tarKey] = typeof converter === 'function' ? converter(srcObj[srcKey]) : srcObj[srcKey];
      }
    }
  }
  return tarObj;
};

/**
 * @since 0.0.1
 *
 * @description Assign all excluded specific ones enumerable own properties from source to target object.
 * perform the same as `Object.assign(a, b)`.
 *
 * @param  {Object} tarObj - target object.
 * @param  {Object} srcObj - source object.
 * @param  {String[]} range - excluded keys from assignment.
 * @return {Object} tarObj - assigned target object.
 *
 * @example
 * const obj = assignWithout({}, {
 *   a: 1,
 *   b: 'abc'
 * }, ['a']);
 * assert(obj.b === 'abc');
 * assert(!('a' in obj));
 */
function assignWithout(tarObj, srcObj, range) {
  if (tarObj == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  if (srcObj != null && Array.isArray(range)) {
    for (const key of ownKeys(srcObj)) {
      if (Object.getOwnPropertyDescriptor(srcObj, key).enumerable && range.indexOf(key) < 0) {
        tarObj[key] = srcObj[key];
      }
    }
  }
  return tarObj;
};

/**
 * @since 0.0.1
 *
 * @description convert attributes of object literal(or own keys of an object).
 *
 * @param  {Object} obj - target object.
 * @param  {Array[]} items - conversion list.
 * @param  {String} items[].0 - key name.
 * @param  {*} items[].1 - function or directly returned other types.
 * @return {Object} obj - converted target object.
 *
 * @example
 * const obj = {
 *   a: 1,
 *   b: 2
 * };
 * convert(obj, [
 *   ['a', 2],
 *   ['b', v => -v]
 * ]);
 *
 * assert(obj.a === 2);
 * assert(obj.b === -2);
 */
function convert(obj, items) {
  for (const item of items) {
    if (Array.isArray(item)) {
      if (item[0] && Object.prototype.hasOwnProperty.call(obj, item[0])) {
        const converter = item[1];
        if (typeof converter === 'function') {
          obj[item[0]] = converter(obj[item[0]]);
        } else {
          obj[item[0]] = converter;
        }
      }
    }
  }
  return obj;
};

/**
 * @since 0.0.1
 *
 * @description Delete attribute(s) whose value is undefined from object literal(or own keys of an object).
 * traversing by {@link ownKeys}.
 *
 * @param  {Object} obj - target object.
 * @return {Object} obj - deundefined obj.
 *
 * @example
 * const obj = {
 *   a: undefined,
 *   b: 1
 * };
 * assert('a' in obj);
 * deundefined(obj);
 * assert(!('a' in obj));
 */
function deundefined(obj) {
  for (const key of ownKeys(obj)) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};

/**
 * @since 0.0.1
 * @description delete attribute(s) of which value is an empty object literal(or own keys of an object).
 * traversing by {@link ownKeys}.
 *
 * @param  {Object} obj
 * @return {Object} obj  deemptied obj.
 *
 * @example
 * const obj = {
 *   a: undefined,
 *   b: {}
 * };
 * assert('b' in obj);
 * deempty(obj);
 * assert('a' in obj);
 * assert(!('b' in obj));
 * deundefined(obj);
 * assert(!('a' in obj));
 */
function deempty(obj) {
  for (const key of ownKeys(obj)) {
    if (isJSON(obj[key]) && !ownKeys(obj[key]).length) {
      delete obj[key];
    }
  }
  return obj;
};

/**
 * @desc deduplicate array.
 *
 * @param  {Array}  arr
 * @param  {Boolean} [isDedupOrigin=false]
 * - if true, deduplicate the original array.
 * - if false, return a new array with deduplicated values.
 * @return {Array|undefined}
 * - if isDedupOrigin is false, return a new array.
 * - if isDedupOrigin is true, return undefined.
 *
 * @example
 * // return a new deduplicate array.
 * const arr = [1, 2, 2, 3, 2, 1, 2, 2, 3];
 * const newArr = dedup(arr);
 * assert.deepStrictEqual(newArr, [1, 2, 3]);
 * assert(arr !== newArr);
 *
 * @example
 * // dedup array itself.
 * const arr = [1, 2, 2, 3, 2, 1, 2, 2, 3];
 * dedup(arr, true);
 * assert.deepStrictEqual(arr, [1, 2, 3]);
 */
function dedup(arr, isDedupOrigin) {
  if (!isDedupOrigin) {
    return Array.from(new Set(arr));
  } else {
    if (arr.length < 2) {
      return;
    }
    let m = 0;
    let d = 0;
    do {
      if (m in arr) {
        const v = arr[m];
        let n = arr.length - 1;
        while (n > m) {
          if (n in arr && arr[n] === v) {
            delete arr[n];
            d++;
          }
          n--;
        }
      }
    } while (++m < arr.length)

    for (let i = 0; i <= arr.length - 1; i++) {
      if (!(i in arr)) {
        arr[i] = arr[i + 1];
        delete arr[i + 1];
      }
    };
    arr.length = arr.length - d;
  }
}

/**
 * @description  Set key alias.
 *
 * @param  {Object} obj - source object.
 * @param  {Object} props - key and alias pairs.
 * @param  {Object} [options] - options.
 * @param  {Boolean} [options.getter=false] - link keys through 'getter'..
 * @return {Object} - return input object.
 *
 * @example
 * const obj = alias({a: {}, b: {}}, {a: 'alpha', 'b': ['beta', 'Beta']});
 * assert(obj.a === obj.alpha);
 * assert(obj.b === obj.beta);
 * assert(obj.b === obj.Beta);
 */
function alias(obj, props, options) {

  const set = (options && options.getter)
    ? function (tarKey, srcKey) {
        obj.__defineGetter__(tarKey, () => obj[srcKey]);
      }
    : function (tarKey, srcKey) {
        obj[tarKey] = obj[srcKey];
      };
  Object.keys(props).forEach(srcKey => {
    const tarKey = props[srcKey];
    if (Array.isArray(tarKey)) {
      for (const k of tarKey) set(k, srcKey);
    } else {
      set(tarKey, srcKey);
    }
  });
  return obj;
}

const REG_DATE_FORMAT = /(%+)(y|mm|m|dd|d|D|HH|H|MM|M|SS|S|TT|T)/g;

/**
 * @desc Read a date with human friendly keys, also format s string with keys replacement.
 *
 * @param  {Object|Number} date - an acceptable value of Date.prototype.constructor.
 * @param  {String} [pattern] - a string, of which parts will be replaced through available key-values. see details in below examples.
 * @return {Object|String} - if pattern is available, return formatted string,
 * else return an object with keys and format method.
 *
 * @example
 * readDate(new Date(2018, 0, 1, 1, 1, 1, 1), '%y-%m-%d %H:%M:%S.%T'); // 2018-1-1 1:1:1.1
 * // zero padding in front.
 * readDate(new Date(2018, 0, 1, 1, 1, 1, 1), '%y-%mm-%dd %HH:%MM:%SS.%TT'); // 2018-01-01 01:01:01.001
 *
 * @example
 * const d = readDate(new Date(2018, 0, 1, 1, 1, 1, 1);
 * console.log(d.format('%y-%m-%d %H:%M:%S.%T')); // 2018-1-1 1:1:1.1
 * console.log(d.year); // 2018
 * console.log(d.y); // 2018
 * // alias:
 * //  y: year
 * //  m: month
 * //  d: date
 * //  D: day
 * //  H: hour
 * //  M: minute
 * //  S: second
 * //  T: millisecond
 */
function readDate(date, pattern) {
  /* support timestamp */
  date = new Date(date);
  const data = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    D: date.getDay(),
    H: date.getHours(),
    M: date.getMinutes(),
    S: date.getSeconds(),
    T: date.getMilliseconds(),
    get mm() {
      return padding(this.m, 2);
    },
    get dd() {
      return padding(this.d, 2);
    },
    get HH() {
      return padding(this.H, 2);
    },
    get MM() {
      return padding(this.M, 2);
    },
    get SS() {
      return padding(this.S, 2);
    },
    get TT() {
      return padding(this.T, 3);
    },
    format(pat) {
      return pat.replace(REG_DATE_FORMAT, (str, delimiter, key) => {
        const rep = (delimiter.length % 2) ? this[key] : key;
        return '%'.repeat(delimiter.length / 2) + rep;
      });
    }
  };
  if (pattern) {
    return data.format(pattern);
  } else {
    /* given alias */
    alias(data, {
      y: 'year',
      m: 'month',
      d: 'date',
      D: 'day',
      H: 'hour',
      M: 'minute',
      S: 'second',
      T: 'millisecond'
    }, { getter: true });
    return data;
  }
}

/**
 * @desc Padding integer on the left.
 *
 * @param  {Number} src - source number to padding on, number string is okay.
 * @param  {Number} length - total length of output string.
 * @param  {String} {char=0} - padding character, a string with more than one character is treated as a whole.
 * @return {String}
 *
 * @example
 * console.log(padding(1, 2)); // 01
 * console.log(padding(1, 2, '~')); // ~1
 */
function padding(src, length, char) {
  char = char || '0'; // char is expected to be one character.
  return char.repeat(Math.max(0, length - src.toString().length)) + src;
}

module.exports = {
  ownKeys,
  assignWithin,
  assignWithout,
  convert,
  deundefined,
  deempty,
  dedup,
  alias,
  readDate,
  padding
};
