# helper
> some helper functions.

[![Build Status](https://www.travis-ci.org/lakca/helper.svg?branch=master)](https://www.travis-ci.org/lakca/helper)
[![codecov](https://codecov.io/gh/lakca/helper/branch/master/graph/badge.svg)](https://codecov.io/gh/lakca/helper)
[![GitHub issues](https://img.shields.io/github/issues/lakca/helper.svg)](https://github.com/lakca/helper/issues)
[![GitHub stars](https://img.shields.io/github/stars/lakca/helper.svg)](https://github.com/lakca/helper)

## Documentation
- [Newest][newDoc], maybe is unstable.
- Look up [available docs of different versions][docFolder], which are stable.
- Preview different versions doc with link `https://lakca.github.io/helper/docs/@lakca/helper/${version}`

## API

- [assignWithin](#assignwithin)
- [assignWithout](#assignwithout)
- [convert](#convert)
- [deundefined](#deundefined)
- [deempty](#deempty)
- [ownKeys](#ownkeys)
- ...more, read [docs](#documentation)

### assignWithin
```javascript
const obj = helper.assignWithin({}, {
    a: 1,
    b: 2,
    c: 3
  }, [
    'a', 
    ['b', 'x'], 
    ['c', 'c', v => v + 1]
  ]);
/*
  obj = {
    a: 1,
    x: 2,
    c: 4
  }
 */
```

### assignWithout
```javascript
const obj = helper.assignWithout({}, {
    a: 1,
    b: 2,
    c: 3
  }, ['c']);
/*
  obj = {
    a: 1,
    b: 2
  }
 */
```

### convert
```javascript
const obj = helper.convert({
    a: 1,
    b: 2,
    c: 3
  }, [
    ['c', v => v + 1]
  ]);
/*
  obj = {
    a: 1,
    b: 2,
    c: 4
  }
 */
```

### deundefined
```javascript
const obj = helper.deundefined({
    a: 1,
    b: 2,
    c: undefined
  });
/*
  obj = {
    a: 1,
    b: 2
  }
 */
```

### deempty
```javascript
const obj = helper.deempty({
    a: 1,
    b: 2,
    c: {}
  });
/*
  obj = {
    a: 1,
    b: 2
  }
 */
```

### ownKeys
> same as `Reflect.ownKeys` in es6 spec.

```javascript
const c = Symbol('sym');
const keys = helper.ownKeys({
    a: 1,
    b: 2,
    [c]: 3 
  });
/*
  keys = ['a', 'b', c];
 */
```

## Dependency
  None

## License

  [MIT](LICENSE)

[newDoc]:https://lakca.github.io/helper/docs
[docFolder]:https://github.com/lakca/helper/tree/master/docs/@lakca/docs
