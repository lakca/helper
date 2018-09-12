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

describe('alias', function() {
  it('test normal set', function() {
    const obj = {
      a: 1,
      b: {}
    };
    helper.alias(obj, {
      a: 'A',
      b: ['B']
    });
    assert(obj.a === obj.A);
    assert(obj.b === obj.B);
  });
  it('test getter set', function() {
    const obj = {
      a: 1,
      b: {}
    };
    helper.alias(obj, {
      a: 'A',
      b: ['B']
    }, {getter: true});
    assert(obj.a === obj.A);
    assert(obj.b === obj.B);
    obj.a = 2;
    obj.b = {};
    assert(obj.a === obj.A);
    assert(obj.b === obj.B);
  });
});

describe('padding', function() {
  it('test normal set', function() {
    assert(helper.padding(1, 2), '01');
    assert(helper.padding(1, 2, '-'), '-1');
  });
});

describe('readDate', function() {
  const dates = [new Date(), new Date(2018, 0, 1, 1, 1, 1, 1)];
  function read(date) {
    return {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      D: date.getDay(),
      H: date.getHours(),
      M: date.getMinutes(),
      S: date.getSeconds(),
      T: date.getMilliseconds(),
      get mm() {
        return helper.padding(this.m, 2);
      },
      get dd() {
        return helper.padding(this.d, 2);
      },
      get HH() {
        return helper.padding(this.H, 2);
      },
      get MM() {
        return helper.padding(this.M, 2);
      },
      get SS() {
        return helper.padding(this.S, 2);
      },
      get TT() {
        return helper.padding(this.T, 3);
      }
    };
  };
  const expectations = [{
    formatter: '%y-%m-%d %H:%M:%S.%T',
    expectStr(date) {
      const d = read(date);
      return `${d.y}-${d.m}-${d.d} ${d.H}:${d.M}:${d.S}.${d.T}`;
    }
  }, {
    formatter: '%%%y-%%m-%d %H:%%%M:%S.%%%T',
    expectStr(date) {
      const d = read(date);
      return `%${d.y}-%m-${d.d} ${d.H}:%${d.M}:${d.S}.%${d.T}`;
    }
  }, {
    formatter: '%y-%mm-%dd %HH:%MM:%SS.%TT',
    expectStr(date) {
      const d = read(date);
      return `${d.y}-${d.mm}-${d.dd} ${d.HH}:${d.MM}:${d.SS}.${d.TT}`;
    }
  }];
  it('return object without format string', function() {
    for (const date of dates) {
      const data = helper.readDate(date);
      const d = read(date);
      assert(data.y === d.y, 'get original data "year" error');
      assert(data.m === d.m, 'get original data "month" error');
      assert(data.d === d.d, 'get original data "date" error');
      assert(data.D === d.D, 'get original data "day" error');
      assert(data.H === d.H, 'get original data "hour" error');
      assert(data.M === d.M, 'get original data "minute" error');
      assert(data.S === d.S, 'get original data "second" error');
      assert(data.T === d.T, 'get original data "millisecond" error');
      assert(data.mm === d.mm, 'get original padding data "month" error');
      assert(data.dd === d.dd, 'get original padding data "date" error');
      assert(data.HH === d.HH, 'get original padding data "hour" error');
      assert(data.MM === d.MM, 'get original padding data "minute" error');
      assert(data.SS === d.SS, 'get original padding data "second" error');
      assert(data.TT === d.TT, 'get original padding data "millisecond" error');
      // format.
      for (const t of expectations) {
        assert(data.format(t.formatter) === t.expectStr(date), `format ${t.formatter} error`);
      }
      for (const k of ['y', 'm', 'd', 'D', 'H', 'M', 'S', 'T']) {
        data[k] += 1;
      }
      // getter.
      assert(data.y === data.year, 'getter "year" error');
      assert(data.m === data.month, 'getter "month" error');
      assert(data.d === data.date, 'getter "date" error');
      assert(data.D === data.day, 'getter "day" error');
      assert(data.H === data.hour, 'getter "hour" error');
      assert(data.M === data.minute, 'getter "minute" error');
      assert(data.S === data.second, 'getter "second" error');
      assert(data.T === data.millisecond, 'getter "millisecond" error');
    }
  });
  it('return replaced string with formatter', function() {
    for (const date of dates) {
      for (const t of expectations) {
        assert(helper.readDate(date, t.formatter) === t.expectStr(date), `directly format ${t.formatter} error.`);
      }
    }
  });
});
