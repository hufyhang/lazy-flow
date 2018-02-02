import LazyBase, { IBuffer, MultiResult } from './base';
import { Lazy } from './lazy';

export default class LazyMerge extends LazyBase {
  constructor(private guest: any[] | Lazy) {
    super();
    this.iteratable = true;
  }

  value(item: any, buffer: IBuffer) {
    let result: any[] = [];
    if (this.guest instanceof Lazy) {
      this.guest = this.guest.value();
    }

    if ((this.guest as any[]).length) {
      result = [item, (this.guest as any[]).shift()];
    } else {
      result = [item];
    }

    if (buffer.isLastIteration) {
      (this.guest as any[]).forEach((o: any) => {
        result.push(o);
      });
    }

    buffer.accumulator = new MultiResult(result);

    return true;
  }
}
