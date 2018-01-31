export interface IBuffer {
  accumulator: any;
}

export default abstract class LazyBase {
  protected iteratable: boolean;

  public isIteratable(): boolean {
    return this.iteratable;
  }

  public value(item: any, buffer?: IBuffer): any {};
}
