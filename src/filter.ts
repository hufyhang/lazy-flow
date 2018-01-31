import LazyBase, { IBuffer } from './base';

export type TFilterCondition = (item: any) => boolean;

export default class LazyFilter extends LazyBase {
  private condition: TFilterCondition;

  constructor(condition: TFilterCondition) {
    super();
    this.iteratable = true;
    this.condition = condition;
  }

  value(item: any, buffer: IBuffer) {
    const result = this.condition(item);
    if (result) {
      buffer.accumulator = item;
    }
    return result;
  }
}
