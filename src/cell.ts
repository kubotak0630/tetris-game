import { MinoColor } from './mino';

export type CellState = MinoColor | 'None' | 'Wall';

export default class Cell {
  private _state: CellState;
  // private _pos: Pos; //初期化時に配置座標を記憶しておく

  constructor(state: CellState) {
    this._state = state;
  }

  set cellState(state: CellState) {
    this._state = state;
  }

  get cellState(): CellState {
    return this._state;
  }
}
