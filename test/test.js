const lazyFlow = require('../dist/lazy').default;
const assert = require('assert');

const equal = assert.deepEqual;

describe('Lazy Flow', () => {
  it('应当为纯函数', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    lazyFlow(arr).map(x => x * 10).filter(x => x > 50).merge([1, 2, 3]).value();
    equal(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    lazyFlow().of(arr).map(x => x * 10).filter(x => x > 50).merge([1, 2, 3]).value();
    equal(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    lazyFlow().of(arr).map(x => x * 10).filter(x => x > 50).take(10).merge([1, 2, 3]).value();
    equal(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('含有初始值时，应该可以通过value直接拿到初始数组', () => {
    equal(lazyFlow([1, 2, 3]).value(), [1, 2, 3]);
    equal(lazyFlow([100]).value(), [100]);
  });

  it('当flow中传递的数组空了时，应当终止flow', () => {
    let counter = 0;
    const arr = lazyFlow().range(1, 10).filter(x => x > 10).do(() => counter += 1).map(x => x).value();
    assert.equal(counter, 0);
  });

  describe('#value', () => {
    it('当存在结果回调函数的话，应当对每个结果元素执行该函数', () => {
      let result = 0;
      const arr = lazyFlow([1, 2, 3, 4, 5]).value(x => {
        result += x;
      });

      assert.equal(result, 15);
    });
  });

  describe('#range', () => {
    it('生成一段数组区间', () => {
      const arr = lazyFlow().range(1, 10).value();
      equal(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('#map', () => {
    it('应当完成对数组的映射', () => {
      let arr = lazyFlow([1, 2, 3]).map(x => x * 10).value();
      equal(arr, [10, 20, 30]);

      arr = lazyFlow().range(1, 5).map(x => x * 100).value();
      equal(arr, [100, 200, 300, 400, 500]);
    });
  });

  describe('#filter', () => {
    it('应当根据条件函数进行过滤', () => {
      let arr = lazyFlow([1, 2, 3, 4, 5, 6]).filter(x => x >= 3).value();
      equal(arr, [3, 4, 5, 6]);

      arr = lazyFlow().range(1, 10).filter(x => x % 2 === 0).map(x => x * 10).value();
      equal(arr, [20, 40, 60, 80, 100]);

      arr = lazyFlow().range(1, 10).filter(x => x % 2 === 0).filter(x => x >= 5).take(2).map(x => x * 10).value();
      equal(arr, [60, 80]);
    });
  });

  describe('#take', () => {
    it('应当从数组中取出相应个数的元素', () => {
      let arr = lazyFlow().range(1, 10).map(x => x).take(5).value();
      equal(arr, [1, 2, 3, 4, 5]);

      arr = lazyFlow().range(1, 10).filter(x => x % 2 === 0).map(x => x * 10).take(3).value();
      equal(arr, [20, 40, 60]);

      arr = lazyFlow().range(1, 10).take(5).value();
      equal(arr, [1, 2, 3, 4, 5]);

      arr = lazyFlow([1, 2, 3, 4, 5]).take(1).value();
      equal(arr, [1]);

      arr = lazyFlow([1, 2, 3, 4, 5]).merge([1, 2, 3, 4, 5]).take(2).map(x => x).take(1).value();
      equal(arr, [1]);

      arr = lazyFlow([1, 2, 3, 4, 5]).merge([1, 2, 3, 4, 5]).take(2).take(1).value();
      equal(arr, [1]);
    });
  });

  describe('#pluck', () => {
    it('应当从对象中取出相应的键值', () => {
      const o = [{
        id: 1,
        name: 'foo'
      }, {
        id: 2,
        name: 'bar'
      }];

      const arr = lazyFlow(o).pluck('name').map(x => x.toUpperCase()).value();
      equal(arr, ['FOO', 'BAR']);
    })
  });

  describe('#chunck', () => {
    it('应当拆分数组', () => {
      let arr = lazyFlow().range(1, 6).chunck(2).value();
      equal(arr, [[1, 2], [3, 4], [5, 6]]);

      const flow$ = lazyFlow(lazyFlow().range(1, 10).value()).chunck(2).take(3).map(x => {
        const a = x[0] || 0;
        const b = x[1] || 0;
        return a + b;
      });

      arr = flow$.value();
      equal(arr, [3, 7, 11]);

      arr = flow$.next([10, 20, 30]);
      equal(arr, [30, 30]);


    });
  });

  describe('#do', () => {
    it('应当对数组中的每个元素执行含有副作用的回调函数', () => {
      let result = 0;
      lazyFlow().range(1, 5).do(x => result += x).value();
      assert.equal(result, 15);
    });
  });

  describe('#of', () => {
    it('应当将数组放置到lazy flow中', () => {
      equal(lazyFlow().of([1, 2, 3]).value(), [1, 2, 3]);
    });
  });

  describe('#from', () => {
    it('应将类数组转化成数组', () => {
      function foo() {
        return lazyFlow().from(arguments).value();
      }

      equal(foo(1, 2, 3), [1, 2, 3]);
    });
  });

  describe('#merge', () => {
    it('应当将另一个数组交叉合并至当前数组', () => {
      let arr = lazyFlow([1, 2, 3]).merge(['a', 'b']).value();
      equal(arr, [1, 'a', 2, 'b', 3]);

      arr = lazyFlow([1]).merge(['a', 'b', 'c']).value();
      equal(arr, [1, 'a', 'b', 'c']);

      arr = lazyFlow([1]).merge(['a', 'b', 'c']).take(3).value();
      equal(arr, [1, 'a', 'b']);

      const flow$ = lazyFlow([1, 2, 3]);
      arr = lazyFlow(['a', 'c', 'd']).take(2).merge(flow$).value();
      equal(arr, ['a', 1, 'c', 2, 3]);
    });
  });

  describe('#some', () => {
    it('应当有任意元素满足条件时继续flow', () => {
      const arr = lazyFlow([1, 2, 3]).some(x => x > 2).reduce((accu, x) => accu + x, 0).value();
      assert.equal(arr, 6);
    });

    it('应当在无元素满足添加时终止flow', () => {
      let temp = 0;
      const arr = lazyFlow([1, 2, 3]).some(x => x > 5).do(x => temp += x).value();
      assert.equal(temp, 0);
    })
  });
});
