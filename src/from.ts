import LazyBase from './base';

export default class LazyFrom extends LazyBase {
  constructor(private arrayList: any) {
    super();
    this.iteratable = false;
  }

  value() {
    return Array.prototype.slice.call(this.arrayList);
  }
}
