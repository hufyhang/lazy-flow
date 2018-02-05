import LazyBase, { IBuffer } from './base';

enum ECondition {
  FALSE = 0,
  TRUE
}

export default class LazyEvery extends LazyBase {
  constructor(private condition: (o: any) => boolean) {
    super();
    this.iteratable = false;
  }

  value(items: any, buffer: IBuffer) {
    for (let item of items) {
      const passed = !!this.condition(item);
      if (!passed) {
        buffer.terminateFlow = true;
        return;
      }
    }

    return items;
  }
}
