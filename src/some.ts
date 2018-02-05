import LazyBase, { IBuffer } from './base';

enum ECondition {
  TRUE = 0,
  FALSE
}

export default class LazySome extends LazyBase {
  constructor(private condition: (o: any) => boolean) {
    super();
    this.iteratable = false;
  }

  value(items: any[], buffer: IBuffer) {
    const somePassed = items
      .map(x => this.condition(x))
      .map(x => x ? ECondition.TRUE : ECondition.FALSE)
      .reduce((accu, x) => accu * x, ECondition.FALSE) === ECondition.TRUE;
    buffer.terminateFlow = !somePassed;
    return items;
  }
}
