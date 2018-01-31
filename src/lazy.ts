import LazyBase from './base';
import LazyRange from './range';
import LazyMap, { TMapTransformer } from './map';

const isArray = (o: any) => Object.prototype.toString.call(o) === '[object Array]';

class Lazy {
  private process: any[];
  private prevIteratable: boolean;

  constructor() {
    this.process = [];
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

  map(trans: TMapTransformer) {
    const instance = new LazyMap(trans);
    this.pushProcess(instance);
    return this;
  }

  value() {
    let result: any;

    this.process.forEach((process: LazyBase|LazyBase[]) => {
      if (isArray(process)) {
        if (!isArray(result)) {
          throw new Error(`Cannot performance iterative processes on non-array type variable: ${ result }`);
        }

        const buffer: any[] = [];
        result.forEach((item: any) => {
          for (let proc of (process as LazyBase[])) {
            if (!proc.value(item, buffer)) {
              break;
            }
          }
        });
        result = buffer;

      } else {
        result = (process as LazyBase).value(result);
      }
    });

    return result;
  }
}


const lazy = new Lazy();
console.log(lazy.range(1, 10).map(i => i * 10).value());
