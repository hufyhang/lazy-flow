import LazyBase from './base';
import LazyRange from './range';
import LazyMap, { TMapTransformer } from './map';
import LazyFilter, { TFilterCondition } from './filter';
import LazyReduce, { TReduceFunc } from './reduce';
import LazyPluck from './pluck';

const isArray = (o: any) => Object.prototype.toString.call(o) === '[object Array]';

export default class Lazy {
  private process: any[];
  private prevIteratable: boolean;
  private _result: any[] = [];

  constructor(initialValue: any[] = []) {
    this.process = [];
    this._result = initialValue;
  }

  private pushProcess(process: LazyBase) {
    if (process.isIteratable()) {
      if (this.prevIteratable) {
        let proc = this.process[this.process.length - 1];
        if (isArray(proc)) {
          proc.push(process);
        } else {
          proc = [proc, process];
        }
        this.process[this.process.length - 1] = proc;
      } else {
        this.process.push([process]);
      }
      this.prevIteratable = true;
    } else {
      this.prevIteratable = false;
      this.process.push(process);
    }
  }

  range(x: number, y: number) {
    const instance = new LazyRange(x, y);
    this.pushProcess(instance);
    return this;
  }

  pluck(key: string) {
    const instance = new LazyPluck(key);
    this.pushProcess(instance);
    return this;
  }

  reduce(func: TReduceFunc, initialValue: any) {
    const instance = new LazyReduce(func, initialValue);
    this.pushProcess(instance);
    return this;
  }

  map(trans: TMapTransformer) {
    const instance = new LazyMap(trans);
    this.pushProcess(instance);
    return this;
  }

  filter(condition: TFilterCondition) {
    const instance = new LazyFilter(condition);
    this.pushProcess(instance);
    return this;
  }

  take(boundry: number) {
    const arr = this.value(boundry);
    const lazy = new Lazy(arr);
    return lazy;
  }

  value(boundry: number) {
    let result: any = this._result;

    for (let process of this.process) {
      if (isArray(process)) {
        if (!isArray(result)) {
          throw new Error(`Cannot performance iterative processes on non-array type variable: ${ result }`);
        }

        const buffer: any[] = [];
        const temp = { accumulator: undefined };
        for (let item of result) {
          let passed = true;
          for (let proc of (process as LazyBase[])) {
            if (!proc.value(item, temp)) {
              passed = false;
              break;
            }
            item = temp.accumulator;
          }
          if (passed) {
            buffer.push(temp.accumulator);
            if (typeof boundry === 'number' && buffer.length >= boundry) {
              break;
            }
          }
        }
        result = buffer;

      } else {
        result = (process as LazyBase).value(result);
      }
    }

    return result;
  }
}
