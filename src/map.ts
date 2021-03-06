import LazyBase, { IBuffer } from './base';

export type TMapTransformer = (item: any) => any;

export default class LazyMap extends LazyBase {
  private transformer: TMapTransformer;

  constructor(transformer: TMapTransformer) {
    super();
    this.iteratable = true;
    this.transformer = transformer;
  }

  value(item: any, buffer: IBuffer) {
    const result = true;
    buffer.accumulator = this.transformer(item);
    return result;
  }
}
