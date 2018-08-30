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

module.exports = {
  ownKeys,
  assignWithin,
  assignWithout,
  convert,
  deundefined,
  deempty
};
