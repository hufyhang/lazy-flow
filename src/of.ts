import LazyBase from './base';

export default class LazyOf extends LazyBase {
  constructor(private list: any[]) {
    super();
    this.iteratable = false;
  }

  value() {
    return this.list.slice(0);
  }
}
