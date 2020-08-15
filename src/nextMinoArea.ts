import Cell from './cell';
import Mino, { MinoColor, MinoIndex } from './mino';

export type Pos = {
  x: number;
  y: number;
};

export default class NextMinoArea {
  static readonly WIDTH = 6;
  static readonly HEIGHT = 10;

  private _cells: Cell[][]; //この情報が描画される
  private _nextMinoList: Mino[];
  constructor() {
    //_cellsの初期化
    this._cells = new Array(NextMinoArea.HEIGHT);
    for (let y = 0; y < NextMinoArea.HEIGHT; y++) {
      this._cells[y] = new Array(NextMinoArea.WIDTH);
      for (let x = 0; x < NextMinoArea.WIDTH; x++) {
        this._cells[y][x] = new Cell('None');
      }
    }
    this._nextMinoList = new Array(3);
  }

  getCell(pos: Pos): Cell {
    return this._cells[pos.y][pos.x];
  }

  setCell(pos: Pos, color: MinoColor): void {
    this._cells[pos.y][pos.x].cellState = color;
  }

  setMinos(minoIndexList: MinoIndex[]) {
    //古いミノを消す
    for (let y = 0; y < NextMinoArea.HEIGHT; y++) {
      for (let x = 0; x < NextMinoArea.WIDTH; x++) {
        this._cells[y][x].cellState = 'None';
      }
    }

    minoIndexList.forEach((elem, index) => {
      //第二引数はここでは関係ない
      this._nextMinoList[index] = new Mino(elem, false);
    });

    this._nextMinoList.forEach((mino, index) => {
      mino.getBasicPos().forEach(pos => {
        const posOffset = { x: pos.x + 2, y: pos.y + 2 + index * 3 };
        this.setCell(posOffset, mino.minoColor);
      });
    });
  }
}
