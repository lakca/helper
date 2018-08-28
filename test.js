'use strict';

const helper = require('./');
const assert = require('assert');

describe('ownKeys', function() {
  it('should return the same as "Reflect.ownKeys"', function() {
    for (const obj of [
      {a: 1, b: 2}, // object literal
      function() {}, // function
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
    const _obj = helper.assignWithin(obj, {
      a: 'ax',
      b: 'bj',
      c: 'nm'
    }, [
      'b',
      ['a', 'x'],
      ['c', 'y', v => v.toUpperCase()]
    ]);
    assert(_obj === obj);
    assert(obj.a === 1);
    assert(obj.b === 'bj');
    assert(obj.x === 'ax');
    assert(obj.y === 'NM');
  });

  it('should throw error when target object is null or undefined', function() {
    assert.throws(helper.assignWithin.bind(undefined, null), TypeError);
    assert.throws(helper.assignWithin.bind(undefined, ), TypeError);
  });
});

describe('assignWithout', function() {
  it('should return as expected', function() {
    const obj = {a: 1, b: 2}
    const _obj = helper.assignWithout(obj, {
      a: 'ax',
      b: 'bj',
      c: 'nm'
    }, ['b']);
    assert(_obj === obj);
    assert(obj.a === 'ax');
    assert(obj.b === 2);
    assert(obj.c === 'nm');
  });

  it('should throw error when target object is null or undefined', function() {
    assert.throws(helper.assignWithout.bind(undefined, null), TypeError);
    assert.throws(helper.assignWithout.bind(undefined, ), TypeError);
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
