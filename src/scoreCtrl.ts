//点数計算やスピードを決定するクラス
export default class ScoreCtrl {
  private _score: number;
  private _level: number;
  private _lines: number;
  readonly SPEED_TABLE: number[]; //60-2, 1マス落ちるのにかかるフレーム数。 60は1Sで1マス落ちるという意味。
  static readonly SPEED_LEVEL_NUM = 20; //speedレベルの数
  constructor() {
    this._level = 1;
    this._score = 0;
    this._lines = 0;

    //SPEED_TABLEの初期化
    this.SPEED_TABLE = [60, 55, 50, 45, 40, 35, 30, 26, 23, 20, 18, 16, 14, 12, 10, 8, 6, 5, 4, 3];

    if (this.SPEED_TABLE.length != ScoreCtrl.SPEED_LEVEL_NUM) {
      console.log('error SPEED_TABLE initialize');
    }
  }

  get lines(): number {
    return this._lines;
  }
  get level(): number {
    return this._level;
  }
  get score(): number {
    return this._score;
  }
  get speed(): number {
    return this.SPEED_TABLE[this._level - 1];
    // return this.SPEED_TABLE[6]; //for debug
  }

  addLineCnt(cntup: number) {
    this._lines += cntup;

    //levelUP, 10ラインで１つレベルが上がる
    if (this._level < ScoreCtrl.SPEED_LEVEL_NUM) {
      this._level = Math.floor(this._lines / 10) + 1;
    }

    //single
    if (cntup === 1) {
      this._score += 40 * this._level;
    }
    //double
    else if (cntup === 2) {
      this._score += 100 * this._level;
    }
    //triple
    else if (cntup === 3) {
      this._score += 300 * this._level;
    }
    //tetris
    else if (cntup === 4) {
      this._score += 1200 * this._level;
    } else {
      console.log('error, addLineCnt');
    }
  }
}
