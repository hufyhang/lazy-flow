import LazyBase, { IBuffer } from './base';

export default class LazyDo extends LazyBase {
  constructor(private func: (value: any) => void) {
    super();
    this.iteratable = true;
  }

  value(item: any, buffer: IBuffer) {
    this.func(item);

    return true;
  }
}
