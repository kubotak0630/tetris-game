import Cell from './cell';
import Mino, { MinoColor } from './mino';

export type Pos = {
  x: number;
  y: number;
};

export default class Board {
  static readonly WIDTH = 10;
  static readonly HEIGHT = 22;

  private _cells: Cell[][]; //この情報が描画される
  private _fixBlocks: Cell[][]; //Minoを積んだ情報
  private _bingoLines: number[];

  constructor() {
    //_cellsの初期化
    this._cells = new Array(Board.HEIGHT);
    for (let y = 0; y < Board.HEIGHT; y++) {
      this._cells[y] = new Array(Board.WIDTH);
      for (let x = 0; x < Board.WIDTH; x++) {
        this._cells[y][x] = new Cell('None');
      }
    }

    //_fixBlocksの初期化
    this._fixBlocks = new Array(Board.HEIGHT);
    for (let y = 0; y < Board.HEIGHT; y++) {
      this._fixBlocks[y] = new Array(Board.WIDTH);
      for (let x = 0; x < Board.WIDTH; x++) {
        //上２段は移動禁止のためブロックを配置
        if (y < 2 && (x <= 2 || x >= 7)) {
          this._fixBlocks[y][x] = new Cell('Wall');
        } else {
          this._fixBlocks[y][x] = new Cell('None');
        }
      }
    }

    this._bingoLines = [];
  }

  getCell(pos: Pos): Cell {
    return this._cells[pos.y][pos.x];
  }
  _getBlockStackCell(pos: Pos): Cell {
    return this._fixBlocks[pos.y][pos.x];
  }

  setCell(pos: Pos, color: MinoColor): void {
    this._cells[pos.y][pos.x].cellState = color;
  }
  clearCell(pos: Pos): void {
    this._cells[pos.y][pos.x].cellState = 'None';
  }
  draw() {
    //ブロックの残像(動く前のデータ)を消すため全て一旦クリアしてからブロックスタック(既に積まれたブロック)を描画

    for (let y = 0; y < Board.HEIGHT; y++) {
      for (let x = 0; x < Board.WIDTH; x++) {
        this._cells[y][x].cellState = 'None';
        this._cells[y][x].cellState = this._fixBlocks[y][x].cellState;
        this._cells[y][x].bingoFlg = this._fixBlocks[y][x].bingoFlg;
      }
    }
  }
  //4点の座標が移動可能かを調べる()
  isMovable(posAry: Pos[]): boolean {
    for (let pos of posAry) {
      //範囲外
      if (!(pos.x >= 0 && pos.x < Board.WIDTH && pos.y >= 0 && pos.y < Board.HEIGHT)) {
        return false;
      }
      //既にブロックが積まれているかどうかのチェック
      else if (this._getBlockStackCell(pos).cellState !== 'None') {
        return false;
      }
    }
    return true;
  }
  //ブロックが確定され積む
  fixMino(mino: Mino) {
    for (let pos of mino.getElementPosAry()) {
      this._fixBlocks[pos.y][pos.x].cellState = mino.minoColor;
    }
  }

  //ラインが消去可能化どうかを調べて、消去する。ずらすのはまだ
  //deleteLineAry: 消去する候補のライン配列
  //戻り値：消去したライン数。0は消去ラインがないことを示す。
  deleteLineStep1(deleteLineAry: number[]): number {
    // console.log('Call deleteLineIfFilled=', deleteLineY);

    this._bingoLines.length = 0;

    //それぞれのラインが揃っているかどうかの判定
    for (let lineY of deleteLineAry) {
      //上の２段は判定しない
      if (lineY < 2) {
        continue;
      }

      let isBingo = true;
      for (let x = 0; x < Board.WIDTH; x++) {
        if (this._fixBlocks[lineY][x].cellState === 'None') {
          isBingo = false;
          break;
        }
      }
      //消去ライン
      if (isBingo) {
        this._bingoLines.push(lineY);
      }
    }

    //消去ラインがないためここで終了
    if (this._bingoLines.length === 0) {
      return 0;
    }

    console.log(`delete lines is ${this._bingoLines}, length=${this._bingoLines.length}`);

    //配列を降順(大きいラインが先)にソート
    this._bingoLines.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });

    this._bingoLines.forEach((deleteLineY, index) => {
      //ライン消去
      for (let x = 0; x < Board.WIDTH; x++) {
        this._fixBlocks[deleteLineY][x].cellState = 'None';
        this._fixBlocks[deleteLineY][x].bingoFlg = true;
      }
    });

    return this._bingoLines.length;
  }

  //step1で消去したラインをずらす
  deleteLineStep2(): void {
    //ラインをずらす
    this._bingoLines.forEach((deleteLineY, index) => {
      //bingoFlgをfalseに戻す
      for (let x = 0; x < Board.WIDTH; x++) {
        this._fixBlocks[deleteLineY][x].bingoFlg = false;
      }

      //最初のライン(indexが0)以外は既に消されて下にずらされたライン分値を足す
      if (index != 0) {
        deleteLineY += index;
      }
      console.log(`line=${deleteLineY} is Bingo!`);

      //ずらす
      for (let y = deleteLineY - 1; y >= 2; y--) {
        for (let x = 0; x < Board.WIDTH; x++) {
          this._fixBlocks[y + 1][x].cellState = this._fixBlocks[y][x].cellState;
        }
      }
    });

    this._bingoLines.length = 0;
  }
}
