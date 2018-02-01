import LazyBase, { IBuffer } from './base';

export default class LazyChunck extends LazyBase {
  constructor(private size: number) {
    super();
    this.iteratable = true;
  }

  value(item: any, buffer: IBuffer) {
    buffer.overrideLast = true;

    if (buffer.accumulator == null || buffer.accumulator.length === this.size) {
      buffer.accumulator = [];
      buffer.overrideLast = false;
    }

    buffer.accumulator.push(item);

    return true;
  }
}
