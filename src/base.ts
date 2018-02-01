export interface IBuffer {
  accumulator: any;
}

export default abstract class LazyBase {
  protected iteratable: boolean;
  protected boundry: boolean;

  public isIteratable(): boolean {
    return this.iteratable;
  }

  public isBoundry(): boolean {
    return this.boundry === true;
  }

  public value(item: any, buffer?: IBuffer): any {};
}
