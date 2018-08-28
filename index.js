'use strict';

const toString = Object.prototype.toString;

function isJSON(obj) {
  return toString.call(obj) === '[object Object]';
}

/**
 * get own keys of an object, the same as 'Reflect.ownKeys' in es6 spec.
 *
 * @param  {object} obj
 * @return {array}
 */
function ownKeys(obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
};

/**
 * ranged Object.assign.
 *
 * @param  {object} tarObj   target object.
 * @param  {object} srcObj   source object.
 * @param  {array} range     range of keys to assign (and convert).
 * @return {object} tarObj   assigned target object.
 *
 * @example:
 *
 *   assignWithin({}, {a: 1, b: 'abc'}, [
 *     ['a', 'x'],
 *     ['b', 'y', v => v.toUpperCase()],
 *   ]);
 *
 *   => {x: 1, y: 'ABC'};
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
 * ranged Object.assign.
 *
 * @param  {object} tarObj   target object.
 * @param  {object} srcObj   source object.
 * @param  {array} range     range of keys to not be assigned.
 * @return {object} tarObj   assigned target object.
 *
 * @example:
 *
 *   assignWithout({}, {a: 1, b: 'abc'}, ['a']);
 *
 *   => {b: 'abc'};
 */
function assignWithout(tarObj, srcObj, range) {
  if (tarObj == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  if (srcObj != null && Array.isArray(range)) {
    for (const key of ownKeys(srcObj)) {
      if (range.indexOf(key) < 0) {
        tarObj[key] = srcObj[key];
      }
    }
  }
  return tarObj;
};

/**
 * convert attributes of object literal(or own keys of an object).
 *
 * @param  {object} obj
 * @param  {array} items    list of item.
 * @param  {array} item
 * @param  {array} item[0]  key of 'obj'.
 * @param  {any} item[1]    converter of the attribute, invokable function or directly returned others.
 * @return {object} obj     converted 'obj'.
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
 * delete attribute(s) of which value is undefined for object literal(or own keys of an object).
 *
 * @param  {object} obj
 * @return {object} obj  deundefined obj.
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
 * delete attribute(s) of which value is an empty object literal(or own keys of an object).
 *
 * @param  {object} obj
 * @return {object} obj  deemptied obj.
 */
function deempty(obj) {
  for (const key of ownKeys(obj)) {
    if (isJSON(obj[key]) && !Object.keys(obj[key]).length) {
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
  deempty,
};
