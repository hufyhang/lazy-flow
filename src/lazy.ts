import LazyBase, { IBuffer } from './base';
import LazyRange from './range';
import LazyMap, { TMapTransformer } from './map';
import LazyFilter, { TFilterCondition } from './filter';
import LazyReduce, { TReduceFunc } from './reduce';
import LazyPluck from './pluck';
import LazyTake, { LazyTakeSimple } from './take';
import LazyChunck from './chunck';
import BoundryObject from './boundry_object';
import LazyDo from './do';
import LazyOf from './of';
import LazyFrom from './from';

const isArray = (o: any) => Object.prototype.toString.call(o) === '[object Array]';

const securePush = (buffer: any[], item: any, boundry: number|null) => {
  if (typeof boundry === 'number' && buffer.length + 1 > boundry) {
    return false;
  }

  buffer.push(item);

  return true;
};

export class Lazy {
  private process: any[];
  private prevIteratable: boolean;
  private _result: any[] = [];

  constructor(initialValue: any[] = []) {
    this.process = [];
    this._result = initialValue;
  }

  private pushProcess(process: LazyBase) {
    if (process instanceof LazyTake) {
      this.process = process.getSequence(this.process);
      this.prevIteratable = false;
    } else if (process.isIteratable()) {
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

  /**
   * 将一个数组放入到lazy flow中并返回lazy flow。
   * @param list 需要放入的数组
   */
  of(list: any[]) {
    const instance = new LazyOf(list);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 将类数组对象转化成数组并放入到lazy flow中。
   * @param arrayList 类数组对象
   */
  from(arrayList: any) {
    const instance = new LazyFrom(arrayList);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 生成一个范围在[x, y]闭区间的数组。
   * @param x 起始值
   * @param y 终止值
   */
  range(x: number, y: number) {
    const instance = new LazyRange(x, y);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 针对数组中每个元素执行含有副作用的函数。
   * @param func 回调函数。
   */
  do(func: (value: any) => void) {
    const instance = new LazyDo(func);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 将数组分成容量为size的数组集。
   * @param size 每个数组的容量。
   */
  chunck(size: number) {
    const instance = new LazyChunck(size);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 从对象中取出键名"key"对应的键值，并生成新的数组。
   * @param key 键名
   */
  pluck(key: string) {
    const instance = new LazyPluck(key);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 对数组进行迭代计算，最终返回计算后的最终结果。
   * @param func 用于迭代计算的函数。
   * @param initialValue 迭代结果的初始值。
   */
  reduce(func: TReduceFunc, initialValue: any) {
    const instance = new LazyReduce(func, initialValue);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 对数组中的每一项进行映射转换。
   * @param trans 转换函数。
   */
  map(trans: TMapTransformer) {
    const instance = new LazyMap(trans);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 对数组中的值进行条件过滤。
   * @param condition 条件函数。
   */
  filter(condition: TFilterCondition) {
    const instance = new LazyFilter(condition);
    this.pushProcess(instance);
    return this;
  }

  /**
   * 从数组中取出一定数量的值。（从左侧开始）
   * @param boundry 所需取出的数量。
   */
  take(boundry: number) {
    let instance;

    if (this.process.length === 0
        || !(this.process[this.process.length - 1] instanceof BoundryObject)
        || !this.process[this.process.length - 1].isIteratable()
      ) {
      instance = new LazyTakeSimple(boundry);
    } else {
      instance = new LazyTake(this.process, boundry);
    }
    this.pushProcess(instance);

    return this;
  }

  /**
   * 向Lazy Flow传入新的值并然后流结果。
   * @param value 新的数组或值。
   */
  next(value: any|any[]) {
    let val = value;
    if (!isArray(val)) {
      val = [val];
    }

    this._result = val;
    return this.value();
  }

  /**
   * 使Lazy Flow开始执行。
   * @param processSequence 所需执行的序列
   * @param boundry 该序列的boundry值，用于对计算进行最小化处理
   * @param result 当前序列的执行结果
   */
  value(processSequence: any[] = this.process, boundry: number|null = null, result: any = this._result) {
    for (let process of processSequence) {
      if (process instanceof BoundryObject) {
        result = this.value(
          process.sequence,
          process.boundry,
          result
        );
      } else if (isArray(process)) {
        if (!isArray(result)) {
          throw new Error(`Cannot performance iterative processes on non-array type variable: ${ result }`);
        }

        const buffer: any[] = [];
        const temp: IBuffer = {
          accumulator: undefined,
          currentOutput: undefined
        };
        for (let item of result) {
          let passed = true;
          if (typeof boundry === 'number' && buffer.length > boundry) {
            break;
          }
          for (let proc of (process as LazyBase[])) {
            if (!proc.value(item, temp, result)) {
              passed = false;
              break;
            }
            item = temp.accumulator;
          }
          if (passed) {
            const output = isArray(temp.accumulator) ? (temp.accumulator as any).slice(0) : temp.accumulator;
            if (temp.overrideLast) {
              if (buffer.length === 0) {
                if (!securePush(buffer, output, boundry)) {
                  break;
                }
              } else {
                buffer[buffer.length - 1] = output;
              }
            } else {
              if (!securePush(buffer, output, boundry)) {
                break;
              }
            }
            temp.currentOutput = buffer;
          }
        }
        result = buffer;

      } else {
        result = (process as LazyBase).value(result, { accumulator: undefined, currentOutput: undefined }, result);
      }
    }

    return result;
  }
}

export default function(initialValue?: any[]) {
  initialValue = isArray(initialValue) ? initialValue : [initialValue];
  return new Lazy(initialValue);
};
