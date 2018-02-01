const lazyFlow = require('../dist/lazy').default;
const assert = require('assert');

describe('Lazy Flow', () => {
  it('含有初始值时，应该可以通过value直接拿到初始数组', () => {
    assert.deepEqual(lazyFlow([1, 2, 3]).value(), [1, 2, 3]);
    assert.deepEqual(lazyFlow(100).value(), [100]);
  });

  describe('#range', () => {
    it('生成一段数组区间', () => {
      const arr = lazyFlow().range(1, 10).value();
      assert.deepEqual(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('#map', () => {
    it('应当完成对数组的映射', () => {
      const arr = lazyFlow([1, 2, 3]).map(x => x * 10).value();
      assert.deepEqual(arr, [10, 20, 30]);
    });
  });
});
