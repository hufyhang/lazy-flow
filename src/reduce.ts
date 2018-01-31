import LazyBase, { IBuffer } from './base';

export type TReduceFunc = (accu: any, item: any) => any;

export default class LazyReduce extends LazyBase {
  private func: TReduceFunc;
  private _value: any;

  constructor(func: TReduceFunc, initalValue: any) {
    super();
    this.iteratable = false;
    this.func = func;
    this._value = initalValue;
  }

  value(item: any[]) {
    item.forEach(v => {
      this._value = this.func(this._value, v);
    });
    return this._value;
  }
}
