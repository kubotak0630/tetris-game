import { MinoColor } from './mino';

export type CellState = MinoColor | 'None' | 'Wall' | 'Bingo';

export default class Cell {
  private _state: CellState;
  private _bingoFlg: boolean;
  // private _pos: Pos; //初期化時に配置座標を記憶しておく

  constructor(state: CellState) {
    this._state = state;
    this._bingoFlg = false;
  }

  set cellState(state: CellState) {
    this._state = state;
  }

  get cellState(): CellState {
    return this._state;
  }

  set bingoFlg(flg: boolean) {
    // this._state = 'Blue';
    this._bingoFlg = flg;
    // console.log('aaaaaaaaaaa-bingo', this._bingoFlg);
  }

  get bingoFlg(): boolean {
    return this._bingoFlg;
  }
}
