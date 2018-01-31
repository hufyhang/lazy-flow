import LazyBase from './base';

export default class LazyRange extends LazyBase {
  private from: number;
  private to: number;

  constructor(from: number, to: number) {
    super();
    this.iteratable = false;
    this.from = from;
    this.to = to;
  }

  value() {
    const arr = [];
    if (this.from <= this.to) {
      for (let i = this.from; i <= this.to; ++i) {
        arr.push(i);
      }
    } else {
      for (let i = this.from; i >= this.to; --i) {
        arr.push(i);
      }
    }
    return arr;
  }
}
