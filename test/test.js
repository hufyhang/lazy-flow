const lazyFlow = require('../dist/lazy').default;
const assert = require('assert');

const equal = assert.deepEqual;

describe('Lazy Flow', () => {
  it('含有初始值时，应该可以通过value直接拿到初始数组', () => {
    equal(lazyFlow([1, 2, 3]).value(), [1, 2, 3]);
    equal(lazyFlow(100).value(), [100]);
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
    });
  });

  describe('#take', () => {
    it('应当从数组中取出相应个数的元素', () => {
      let arr = lazyFlow().range(1, 10).map(x => x).take(5).value();
      equal(arr, [1, 2, 3, 4, 5]);

      arr = lazyFlow().range(1, 10).filter(x => x % 2 === 0).map(x => x * 10).take(3).value();
      equal(arr, [20, 40, 60]);
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
    });
  });
});
