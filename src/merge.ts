import LazyBase, { IBuffer, MultiResult } from './base';

export default class LazyMerge extends LazyBase {
  constructor(private guest: any[]) {
    super();
    this.iteratable = true;
  }

  value(item: any, buffer: IBuffer) {
    let result: any[] = [];
    if (this.guest.length) {
      result = [item, this.guest.shift()];
    } else {
      result = [item];
    }

    if (buffer.isLastIteration) {
      this.guest.forEach((o) => {
        result.push(o);
      });
    }

    buffer.accumulator = new MultiResult(result);

    return true;
  }
}
