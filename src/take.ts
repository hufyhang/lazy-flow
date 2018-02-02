import LazyBase, { IBuffer } from './base';
import BoundryObject from './boundry_object';

export default class LazyTake extends LazyBase {
  private _boundry: number;

  constructor(process: any[], boundry: number) {
    super();
    this.iteratable = false;
    this.boundry = true;
    this._boundry = boundry;
  }

  getSequence(process: any[]) {
    return [new BoundryObject(process.slice(0), this._boundry)];
  }
}

export class LazyTakeSimple extends LazyBase {
  constructor(private size: number) {
    super();
    this.iteratable = false;
  }

  value(item: any, buffer: IBuffer, sequence: any[]) {
    if (this.size >= sequence.length) {
      return sequence.slice();
    }

    return sequence.slice(0,this.size);
  }
}
