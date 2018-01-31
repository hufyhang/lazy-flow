import LazyBase, { IBuffer } from './base';

interface IObject {
  [key: string]: any;
}

export default class LazyPluck extends LazyBase {
  private key: string;

  constructor(key: string) {
    super();
    this.iteratable = true;
    this.key = key;
  }

  value(item: IObject, buffer: IBuffer) {
    buffer.accumulator = item[this.key];
    return true;
  }
}
