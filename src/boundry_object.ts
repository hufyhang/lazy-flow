export default class BoundryObject {
  private _sequence: any[];
  private _boundry: number;

  constructor(sequence: any[], boundry: number) {
    this._sequence = sequence;
    this._boundry = boundry;
  }

  get sequence() {
    return this._sequence;
  }

  get boundry() {
    return this._boundry;
  }
}
