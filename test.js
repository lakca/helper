'use strict';

const helper = require('./');
const assert = require('assert');

describe('ownKeys', function() {
  it('should return the same as "Reflect.ownKeys"', function() {
    for (const obj of [
      {a: 1, b: 2} // object literal
    ]) {
      const x = Reflect.ownKeys(obj);
      const y = helper.ownKeys(obj);
      assert(x.length === y.length);
      let i = 0;
      while (i < x.length) {
        assert(x[i] === y[i]);
        i++;
      }
    }
  });
});

describe('assignWithin', function() {
  it('should return as expected', function() {
    const obj = {a: 1, b: 2}
    const sym = Symbol('sym');
    const _obj = helper.assignWithin(obj, {
      a: 'ax',
      b: 'bj',
      [sym]: 'nm'
    }, [
      'b',
      ['a', 'x'],
      [sym, 'y', v => v.toUpperCase()]
    ]);
    assert(_obj === obj);
    assert(obj.a === 1);
    assert(obj.b === 'bj');
    assert(obj.x === 'ax');
    assert(obj.y === 'NM');
  });

  it('should throw error when target object is null or undefined', function() {
    assert.throws(helper.assignWithin.bind(undefined, null), TypeError);
    assert.throws(helper.assignWithin.bind(undefined), TypeError);
  });
});

describe('assignWithout', function() {
  it('should return as expected', function() {
    const obj = {a: 1, b: 2}
    const sym = Symbol('sym');
    const _obj = helper.assignWithout(obj, {
      a: 'ax',
      b: 'bj',
      [sym]: 'nm',
    }, ['b']);
    assert(_obj === obj);
    assert(obj.a === 'ax');
    assert(obj.b === 2);
    assert(obj[sym] === 'nm');
  });

  it('should throw error when target object is null or undefined', function() {
    assert.throws(helper.assignWithout.bind(undefined, null), TypeError);
    assert.throws(helper.assignWithout.bind(undefined), TypeError);
  });
});

describe('convert', function() {
  it('should return as expected', function() {
    const obj = {a: 1, b: 2, c: 3}
    const _obj = helper.convert(obj, [['b', v => 1 + v], ['c', -3]]);
    assert(_obj === obj);
    assert(obj.a === 1);
    assert(obj.b === 3);
    assert(obj.c === -3);
  });
});

describe('deundefined', function() {
  it('should return as expected', function() {
    const obj = {a: undefined, b: 2}
    const _obj = helper.deundefined(obj);
    assert(_obj === obj);
    assert.ifError('a' in obj);
  });
});

describe('deempty', function() {
  it('should return as expected', function() {
    const obj = {a: {}, b: 2}
    const _obj = helper.deempty(obj);
    assert(_obj === obj);
    assert.ifError('a' in obj);
  });
});

describe('dedup', function() {
  it('return new array', function() {
    const arr = [1, 2, 2, 3, 2, 1, 2, 2, 3];
    const newArr = helper.dedup(arr);
    assert.deepStrictEqual(newArr, [1, 2, 3]);
  });
  it('deduplicate original array', function() {
    const arr = [1, 2, 2, 3, 2, 1, 2, 2, 3];
    const r = helper.dedup(arr, true);
    assert(r === undefined, 'expect return undefined');
    assert.deepStrictEqual(arr, [1, 2, 3]);
  });
  it('deduplicate original array which length is less than 2', function() {
    for (const arr of [[1], []]) {
      const _ = JSON.parse(JSON.stringify(arr));
      const r = helper.dedup(arr, true);
      assert(r === undefined, 'expect return undefined');
      assert.deepStrictEqual(arr, _);
    }
  });
});
