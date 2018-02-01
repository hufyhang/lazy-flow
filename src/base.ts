export interface IBuffer {
  accumulator: any;
  currentOutput: any;
  overrideLast?: boolean;
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
