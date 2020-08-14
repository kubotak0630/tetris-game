import Mino, { MinoIndex } from './mino';

export default class MinoBag {
  private _mino7bag1st: MinoIndex[]; //0-6
  private _mino7bag2nd: MinoIndex[]; //0-6
  private _now1stBagFlg: boolean; //どちらのバッグが動作中かを示すフラグ
  private _nextMinoList: MinoIndex[]; //次のミノを３つを入れておく

  constructor() {
    this._mino7bag1st = [];
    this._mino7bag2nd = [];
    this._initBag(true);
    this._initBag(false);
    this._now1stBagFlg = true;
    this._nextMinoList = [];
  }
  _initBag(is1stFlg: boolean) {
    const bag = is1stFlg ? this._mino7bag1st : this._mino7bag2nd;

    //0-7で初期化
    for (let i = 0; i < 7; i++) {
      bag.push(i);
    }
    //シャッフル
    for (let i = bag.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      const tmp = bag[i];
      bag[i] = bag[r];
      bag[r] = tmp;
    }
  }
  getMinoIndex(): MinoIndex {
    const selBag = this._now1stBagFlg ? this._mino7bag1st : this._mino7bag2nd;

    const index = selBag.shift(); //先頭から取得

    //次のMINOを取得
    this._nextMinoList.length = 0;
    this._nextMinoList = selBag.slice(0, 3);
    if (this._nextMinoList.length != 3) {
      const nextBag = this._now1stBagFlg ? this._mino7bag2nd : this._mino7bag1st;
      const tempList = nextBag.slice(0, 3 - this._nextMinoList.length);
      for (let elem of tempList) {
        this._nextMinoList.push(elem);
      }
    }
    console.log(`1stBag:${this._mino7bag1st}`);
    console.log(`2ndBag:${this._mino7bag2nd}`);
    console.log(`nextMino:${this._nextMinoList}`);

    if (selBag.length === 0) {
      //空になったバッグを初期化
      this._initBag(this._now1stBagFlg);
      //動作中のフラグを反転
      this._now1stBagFlg = !this._now1stBagFlg;
    }

    return index!;
  }
  get netxMinoList(): MinoIndex[] {
    return this._nextMinoList;
  }
}
