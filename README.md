# helper
> some helper functions.

## API

- [assignWithin](#assignwithin)
- [assignWithout](#assignwithout)
- [convert](#convert)
- [deundefined](#deundefined)
- [deempty](#deempty)
- [ownKeys](#ownKeys)

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

### dedeundefined
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
