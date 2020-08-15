import Board, { Pos } from './board';
import Mino, { MinoIndex } from './mino';
import MinoBag from './minoBag';
import { Avatar } from 'element-ui';
import NextMinoArea from './nextMinoArea';
import ScoreCtrl from './scoreCtrl';
import AudioCtrl from './audioCtrl';

export default class Tetris {
  private _board: Board;
  private _mino: Mino | null;
  private _nextMinoArea: NextMinoArea;
  private _minoBag: MinoBag;
  private _scoreCtrl: ScoreCtrl;
  private _audioCtrl: AudioCtrl;

  private _gameOverFlg: boolean;
  private _nowLineDeleteFrameCnt: number;

  constructor() {
    this._minoBag = new MinoBag();
    this._board = new Board();
    this._nextMinoArea = new NextMinoArea();
    this._scoreCtrl = new ScoreCtrl();
    this._audioCtrl = new AudioCtrl('./music.mp3');
    this._mino = null;
    this._gameOverFlg = false;
    this._nowLineDeleteFrameCnt = 0;

    this._board.draw();
  }

  get board(): Board {
    return this._board;
  }

  get nextMinoArea(): NextMinoArea {
    return this._nextMinoArea;
  }

  get gameOverFlg(): boolean {
    return this._gameOverFlg;
  }

  get lines(): number {
    return this._scoreCtrl.lines;
  }
  get level(): number {
    return this._scoreCtrl.level;
  }
  get score(): number {
    return this._scoreCtrl.score;
  }
  //Levelに応じた60-2を返す。1マス落下するのにかかるフレーム
  get speed(): number {
    return this._scoreCtrl.speed;
  }

  get music(): AudioCtrl {
    return this._audioCtrl;
  }

  //Minoがゲーム中に存在しているかどうか？
  haveMino(): boolean {
    return this._mino !== null;
  }

  createMino() {
    //バッグから値を取り出す
    const minoIndex = this._minoBag.getMinoIndex();

    this._mino = new Mino(minoIndex!);
  }

  //移動可能なら移動
  //x,yは相対座標, 例: (0, 1)は下に１マス移動, (1, 0)は右に１マス移動
  moveMino(
    x: number,
    y: number,
    rotateFlg: boolean = false,
    isRightRotation: boolean = false
  ): void {
    if (this._mino === null) return;
    const rslt = this._mino.getAfterMovePosAry(x, y, rotateFlg, isRightRotation);
    if (this._board.isMovable(rslt.posAry)) {
      this._mino.move(x + rslt.offsetX, y);
      if (rotateFlg) {
        this._mino.rotate(isRightRotation);
      }
    }
  }
  //影の座標を求める
  private _calcShadowPosAry(): Pos[] {
    if (this._mino === null) return [];

    //影を求める
    let offsetY = 0;
    for (let i = 1; i < Board.HEIGHT; i++) {
      let rslt = this._mino.getAfterMovePosAry(0, i);
      if (!this._board.isMovable(rslt.posAry)) {
        offsetY = i - 1;
        break;
      }
    }
    //影の座標計算
    let posLists = this._mino.getElementPosAry();
    for (let pos of posLists) {
      pos.y += offsetY;
    }
    // console.log(posLists);
    return posLists;
  }

  update(): void {
    this._board.draw();

    if (this._mino === null) return;

    if (this._nowLineDeleteFrameCnt) return;

    //影の設定
    for (let pos of this._calcShadowPosAry()) {
      // console.log(`shadowPos=${pos}`);
      this._board.setCell(pos, 'Shadow');
    }

    //Minoの設定
    for (let elem of this._mino.getElementPosAry()) {
      this._board.setCell(elem, this._mino.minoColor);
    }

    //NextMino領域への設定
    this._nextMinoArea.setMinos(this._minoBag.netxMinoList);
  }

  private _isGameOver(posAry: Pos[]): boolean {
    for (let pos of posAry) {
      if (pos.y < 2) {
        this._gameOverFlg = true;
        break;
      }
    }
    return this._gameOverFlg;
  }

  fixMinoAndLineDelete(): void {
    if (this._mino === null) return;

    //line消去中でない
    if (!this._nowLineDeleteFrameCnt) {
      // もうこれ以上下に動かすことができなかどうかの判定
      const rslt = this._mino.getAfterMovePosAry(0, 1);
      if (!this._board.isMovable(rslt.posAry)) {
        if (this._mino.decrementMarginCnt() <= 0) {
          //GameOver判定
          if (this._isGameOver(this._mino.getElementPosAry())) {
            console.log('GameOver');
            return;
          }

          //ブロック終了
          //積まれたMinoをボード情報に加える
          this._board.fixMino(this._mino);

          //ライン消去処理(消すだけ)
          const delLineNum = this.board.deleteLineStep1(this._mino.getMinoLines());
          if (delLineNum) {
            this._nowLineDeleteFrameCnt = 10;
            this._scoreCtrl.addLineCnt(delLineNum);
          } else {
            this._mino = null;
          }
        }
      }
    } else {
      this._nowLineDeleteFrameCnt--;

      if (this._nowLineDeleteFrameCnt === 0) {
        //ライン消去処理(ずらす)
        this.board.deleteLineStep2();

        // delete this._mino; //ガベコレが効くので明示的にオブジェクトを削除する必要はない
        this._mino = null;
      }
    }
  }
}
