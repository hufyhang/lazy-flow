import BoundryObject from "./boundry_object";

export interface IBuffer {
  accumulator: any;
  currentOutput: any;
  isLastIteration: boolean;
  tempHandlerOutput: any[];
  terminateFlow: boolean;
  overrideLast?: boolean;
}

interface ILazyBoundry {
  getSequence(o: any[]): BoundryObject[];
}

export default abstract class LazyBase {
  // 表示是否需要对数组进行遍历
  protected iteratable: boolean;

  // 表示是否需要设置计算次数上限
  protected boundry: boolean;

  public isIteratable(): boolean {
    return this.iteratable;
  }

  public isBoundry(): boolean {
    return this.boundry === true;
  }

  public value(item: any, buffer?: IBuffer, result?: any[]|any): any {};
}

export abstract class LazyBoundry extends LazyBase implements ILazyBoundry {
  public getSequence(o: any[]) { return ([] as BoundryObject[]); };
}

export class MultiResult {
  constructor(private results: any[]) {}

  getResults() {
    return this.results;
  }
}
