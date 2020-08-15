import Board, { Pos } from './board';

type RotateNumType = 0 | 1 | 2 | 3;
export type MinoColor =
  | 'Cyan'
  | 'Blue'
  | 'Orange'
  | 'Green'
  | 'Red'
  | 'Magenta'
  | 'Yellow'
  | 'Shadow';

export enum MinoIndex {
  'I' = 0,
  'J',
  'L',
  'S',
  'Z',
  'T',
  'O',
}

//Minoタイプと色の対応表
const colorList: MinoColor[] = ['Cyan', 'Blue', 'Orange', 'Green', 'Red', 'Magenta', 'Yellow'];

export default class Mino {
  //Minoが固定されるまでの遊びフレーム, 60fpsの場合は1/60*20=0.33msの遊び
  //ボタン操作は反応が遅れるので0.5ms(30)にする
  static readonly FREE_AFTER_FIX_NORMAL = 18;
  static readonly FREE_AFTER_FIX_SMAPHO = 30;

  private _pos: Pos;
  private _rotateNumber: RotateNumType;
  private readonly _rPoints: number[][][];
  private _moveMarginCnt: number; //下についてから確定するまでの遊び時間。これが０で確定
  private _minoColor: MinoColor;

  constructor(minoIdx: MinoIndex, smaphoMode: boolean) {
    this._rotateNumber = 0;
    this._moveMarginCnt = smaphoMode ? Mino.FREE_AFTER_FIX_SMAPHO : Mino.FREE_AFTER_FIX_NORMAL;
    this._rPoints = [];
    this._minoColor = colorList[minoIdx];
    this._pos = { x: 4, y: 1 }; //出現の中心座標
    let basicPoints: number[][]; //回転０の座標

    console.log('FREE_FIX_TIME', this._moveMarginCnt);

    /**** 基本座標(回転0)を設定 ***********/
    switch (minoIdx) {
      case MinoIndex.T:
        basicPoints = [
          [0, 0],
          [-1, 0],
          [0, -1],
          [1, 0],
        ];
        break;
      case MinoIndex.J:
        basicPoints = [
          [0, 0],
          [-1, 0],
          [1, 0],
          [-1, -1],
        ];
        break;
      case MinoIndex.L:
        basicPoints = [
          [0, 0],
          [-1, 0],
          [1, 0],
          [1, -1],
        ];
        break;
      case MinoIndex.S:
        basicPoints = [
          [0, 0],
          [-1, 0],
          [0, -1],
          [1, -1],
        ];
        break;
      case MinoIndex.Z:
        basicPoints = [
          [0, 0],
          [1, 0],
          [0, -1],
          [-1, -1],
        ];
        break;
      case MinoIndex.O:
        basicPoints = [
          [0, 0],
          [1, 0],
          [0, -1],
          [1, -1],
        ];
        break;
      case MinoIndex.I:
        basicPoints = [
          [-1, 0],
          [0, 0],
          [1, 0],
          [2, 0],
        ];
    }

    /***** 回転座標を設定 **********************/

    //Oは回転不可のため全て同じ座標をいれる
    if (minoIdx === MinoIndex.O) {
      for (let i = 0; i < 4; i++) {
        this._rPoints.push(basicPoints);
      }
      //Iは中心軸が動くので４つとも手動で設定
    } else if (minoIdx === MinoIndex.I) {
      this._rPoints.push(basicPoints);
      this._rPoints.push([
        [0, -1],
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
      this._rPoints.push([
        [-1, 1],
        [0, 1],
        [1, 1],
        [2, 1],
      ]);
      this._rPoints.push([
        [1, -1],
        [1, 0],
        [1, 1],
        [1, 2],
      ]);
    } else {
      this._rPoints.push(basicPoints);
      this._rPoints.push(this._calcRotatePoint(basicPoints, 90));
      this._rPoints.push(this._calcRotatePoint(basicPoints, 180));
      this._rPoints.push(this._calcRotatePoint(basicPoints, 270));
    }
  }

  get minoColor(): MinoColor {
    return this._minoColor;
  }

  //next表示のために基本図形を返す
  getBasicPos(): Pos[] {
    const pos0: Pos = { x: this._rPoints[0][0][0], y: this._rPoints[0][0][1] };
    const pos1: Pos = { x: this._rPoints[0][1][0], y: this._rPoints[0][1][1] };
    const pos2: Pos = { x: this._rPoints[0][2][0], y: this._rPoints[0][2][1] };
    const pos3: Pos = { x: this._rPoints[0][3][0], y: this._rPoints[0][3][1] };

    return [pos0, pos1, pos2, pos3];
  }

  _calcRotatePoint(points: number[][], degree: number) {
    const rRad = (degree / 180) * Math.PI;
    let retPoints: number[][] = [];

    //0が０にならないので、整数に丸める。0でビットの論理和をとる。
    //暫定
    points.forEach((point, index) => {
      let x = ((Math.cos(rRad) * point[0]) | 0) - ((Math.sin(rRad) * point[1]) | 0);
      let y = ((Math.sin(rRad) * point[0]) | 0) + ((Math.cos(rRad) * point[1]) | 0);
      retPoints.push([x, y]);
    });

    return retPoints;
  }

  get pos(): Pos {
    return this._pos;
  }
  decrementMarginCnt(): number {
    this._moveMarginCnt--;
    // console.log(this._moveMarginCnt);
    return this._moveMarginCnt;
  }

  move(x: number, y: number) {
    const x0 = this._pos.x + x;
    const y0 = this._pos.y + y;
    this._pos = { x: x0, y: y0 };
  }
  rotate(isRightRotation: boolean) {
    this._rotateNumber = this.getNextRotateNum(isRightRotation);
  }

  //次の_rotateNumberを求める。右回転は-1,左回転は+1
  private getNextRotateNum(isRightRotation: boolean): RotateNumType {
    let nextNum: RotateNumType;

    if (!isRightRotation) {
      if (this._rotateNumber === 3) {
        nextNum = 0;
      } else {
        nextNum = (this._rotateNumber + 1) as RotateNumType;
      }
    } else {
      if (this._rotateNumber === 0) {
        nextNum = 3;
      } else {
        nextNum = (this._rotateNumber - 1) as RotateNumType;
      }
    }
    return nextNum;
  }

  //移動(回転)後の座標を返す
  //この関数をコールしただけでは_posは変更しないことに注意。moveで実際に移動する
  //回転時は両端にいるときはオフセット付きで移動後の座標を返す
  getAfterMovePosAry(
    x: number,
    y: number,
    rotateFlg: boolean = false,
    isRightRotation: boolean = false
  ): { posAry: Pos[]; offsetX: number } {
    //中心座標の移動後の位置
    const x0 = this._pos.x + x;
    const y0 = this._pos.y + y;

    let nextRotateNum = rotateFlg ? this.getNextRotateNum(isRightRotation) : this._rotateNumber;
    let offset_x = 0;
    const pos0 = {
      x: x0 + this._rPoints[nextRotateNum][0][0],
      y: y0 + this._rPoints[nextRotateNum][0][1],
    };
    const pos1 = {
      x: x0 + this._rPoints[nextRotateNum][1][0],
      y: y0 + this._rPoints[nextRotateNum][1][1],
    };
    const pos2 = {
      x: x0 + this._rPoints[nextRotateNum][2][0],
      y: y0 + this._rPoints[nextRotateNum][2][1],
    };
    const pos3 = {
      x: x0 + this._rPoints[nextRotateNum][3][0],
      y: y0 + this._rPoints[nextRotateNum][3][1],
    };

    //回転の場合はオフセットを考慮する。(両端で回転できる仕様)
    if (rotateFlg) {
      //4点のｘ座標のMax,Minを求める
      const max_x = Math.max(pos0.x, pos1.x, pos2.x, pos3.x);
      const min_x = Math.min(pos0.x, pos1.x, pos2.x, pos3.x);

      if (max_x >= Board.WIDTH) {
        offset_x = Board.WIDTH - (max_x + 1);
      } else if (min_x < 0) {
        offset_x = -min_x;
      }
      //offset_xを考慮
      pos0.x += offset_x;
      pos1.x += offset_x;
      pos2.x += offset_x;
      pos3.x += offset_x;
    }

    return { posAry: [pos0, pos1, pos2, pos3], offsetX: offset_x };
  }
  //Minoの４つの座標を取得
  getElementPosAry(): Pos[] {
    const pos0 = {
      x: this.pos.x + this._rPoints[this._rotateNumber][0][0],
      y: this.pos.y + this._rPoints[this._rotateNumber][0][1],
    };
    const pos1 = {
      x: this.pos.x + this._rPoints[this._rotateNumber][1][0],
      y: this.pos.y + this._rPoints[this._rotateNumber][1][1],
    };
    const pos2 = {
      x: this.pos.x + this._rPoints[this._rotateNumber][2][0],
      y: this.pos.y + this._rPoints[this._rotateNumber][2][1],
    };
    const pos3 = {
      x: this.pos.x + this._rPoints[this._rotateNumber][3][0],
      y: this.pos.y + this._rPoints[this._rotateNumber][3][1],
    };

    return [pos0, pos1, pos2, pos3];
  }

  //Minoの４点情報から重複しないY座標情報を抜き出す。ラインの配列を返す
  getMinoLines(): number[] {
    let lineList: number[] = [];
    for (let pos of this.getElementPosAry()) {
      if (lineList.indexOf(pos.y) < 0) {
        lineList.push(pos.y);
      }
    }
    return lineList;
  }
}
