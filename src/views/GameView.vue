<template>
  <div class="game-wrapper">
    <div class="game-top">
      <el-button class="back-titile-button" size="small" type="primary" @click="onClicBackTitle"
        >タイトルへ戻る</el-button
      >

      <!-- <div id="target">長押ししてください</div> -->

      <div class="game-view">
        <VBord v-bind:board="tetris.board"></VBord>

        <div class="next-socre-wrapper">
          <div>NEXT</div>
          <VNextMinoArea v-bind:nextArea="tetris.nextMinoArea"></VNextMinoArea>
          <div class="tag-level">Level</div>
          <div>{{ computedLevel }}</div>
          <div class="tag-line">Line</div>
          <div>{{ computedLine }}</div>
          <div class="tag-score">Score</div>
          <div>{{ computedScore }}</div>
          <el-button class="stop-button" type="primary" @click="onClickStop">{{
            stopFlg ? 'Resume' : 'Stop'
          }}</el-button>
        </div>
      </div>

      <div class="key-wrapper">
        <div class="dir-key">
          <div class="key-left-right-wrapper">
            <el-button
              class="key-left"
              type="info"
              icon="el-icon-caret-left"
              @click="onBtnKeyLeft"
            ></el-button>
            <el-button
              class="key-right"
              type="info"
              icon="el-icon-caret-right"
              @click="onBtnKeyRight"
            ></el-button>
          </div>
          <div>
            <el-button
              id="target"
              class="key-down"
              type="info"
              icon="el-icon-caret-bottom"
              @click="onBtnKeyDown"
            ></el-button>
          </div>
        </div>
        <div>
          <el-button
            class="key-left-rotate"
            type="info"
            icon="el-icon-refresh-right"
            @click="onBtnKeyRotateRight"
          ></el-button>
          <el-button
            class="key-right-rotate"
            type="info"
            icon="el-icon-refresh-left"
            @click="onBtnKeyRotateLeft"
          ></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import VBord from '../components/VBord.vue';
import VNextMinoArea from '../components/VNextMinoArea.vue';
import Tetris from '../tetris';
import Hammer from 'hammerjs';

type DataType = {
  tetris: Tetris;
  // interval: number | undefined;
  animationId: number;
  prevTimestamp: number;
  gCoutner: number;
  stopFlg: boolean;
  fpsInterval: number; //ms
};

export default Vue.extend({
  name: 'GameView',
  components: {
    VBord,
    VNextMinoArea,
  },
  props: {
    isPlyaMusic: {
      type: String as PropType<'on' | 'off'>,
      // required: true,
      default: 'off',
    },
  },
  data(): DataType {
    return {
      tetris: new Tetris(),
      animationId: 0,
      // interval: undefined,
      prevTimestamp: 0,
      gCoutner: 0,
      stopFlg: false,
      fpsInterval: 1000 / 60, //分母は60で割り切れる数に対応(30,20,15,10 etc)
    };
  },
  beforeCreate() {},
  async created() {
    console.log('--call created--');

    // ipadは全画面表示にしない。スマホのみ全画面表示
    if (document.documentElement.clientWidth < 500) {
      document.body.requestFullscreen();
    }
  },
  mounted() {
    console.log('--call mounted--');
    document.onkeydown = (ev: KeyboardEvent) => {
      if (ev.keyCode === 37) this.actionKey('left');
      else if (ev.keyCode === 38) this.actionKey('up');
      else if (ev.keyCode === 39) this.actionKey('right');
      else if (ev.keyCode === 40) this.actionKey('down');
      //z key
      else if (ev.keyCode === 90) this.actionKey('right-rotation');
      //x key
      else if (ev.keyCode === 88) this.actionKey('left-rotation');
    };

    const deviceWidth = document.documentElement.clientWidth;
    this.tetris.smaphoModeFlg = deviceWidth <= 834;

    const elm = document.querySelector('#target');
    const manager = new Hammer.Manager(elm!);
    const hammertime = new Hammer.Press({
      time: 500,
    });

    // Add the recognizer to the manager
    manager.add(hammertime);

    // Subscribe to desired event
    manager.on('press', function(e: any) {
      alert('pressed!');
    });

    this.prevTimestamp = performance.now();
    this.animationId = requestAnimationFrame(this.gameLoop.bind(this));
    if (this.isPlyaMusic == 'on') {
      this.tetris.music.play();
    }
  },
  computed: {
    computedScore(): number {
      return this.tetris.score;
    },
    computedLine(): number {
      return this.tetris.lines;
    },
    computedLevel(): number {
      return this.tetris.level;
    },
  },
  methods: {
    actionKey(key: 'left' | 'right' | 'down' | 'up' | 'right-rotation' | 'left-rotation'): void {
      if (this.stopFlg) return;

      switch (key) {
        case 'left':
          this.tetris.moveMino(-1, 0);
          console.log('key-left');
          break;
        case 'right':
          this.tetris.moveMino(1, 0);
          break;
        case 'down':
          this.tetris.moveMino(0, 1);
          break;
        case 'up':
          this.tetris.moveMino(0, -1);
          break;
        case 'right-rotation':
          this.tetris.moveMino(0, 0, true, true);
          break;
        case 'left-rotation':
          this.tetris.moveMino(0, 0, true, false);
          break;
      }
    },

    gameLoop(timestamp: number) {
      //ループコンテンツを行う前に次をスケジュールする。これがベストプラクティスらしい。
      this.animationId = requestAnimationFrame(this.gameLoop.bind(this));

      const elapsedTime = timestamp - this.prevTimestamp;

      //厳密にするとフレームが飛ばされるので95%で判定
      if (elapsedTime > this.fpsInterval * 0.95) {
        this.prevTimestamp = timestamp;

        // console.log(`${elapsedTime.toFixed(4)} fps=${(1000 / elapsedTime).toFixed(2)} `);

        this.gCoutner++; //double型で仮数部が52bitなのでオーバーフローは心配する必要ない

        if (this.stopFlg) {
          cancelAnimationFrame(this.animationId);
          return;
        }

        if (this.tetris.gameOverFlg) {
          cancelAnimationFrame(this.animationId);
          return;
        }

        const speedFrame = this.tetris.speed;

        if (!this.tetris.haveMino()) {
          this.tetris.createMino();
          this.gCoutner -= this.gCoutner % speedFrame; //カウンタの下を０にすることで出現後speedFrameフレーム止まる
          return;
        }

        if (this.gCoutner % speedFrame === 0) {
          this.tetris.moveMino(0, 1);
        }
        this.tetris.fixMinoAndLineDelete();
        this.tetris.update();
      }

      // console.log(`${performance.now() - timeA}`);
    },
    onClickStop() {
      this.stopFlg = !this.stopFlg;

      //Stop処理
      if (this.stopFlg) {
        this.tetris.music.pause();
      }
      //再開処理
      else if (!this.stopFlg) {
        this.animationId = requestAnimationFrame(this.gameLoop.bind(this));
        if (this.isPlyaMusic == 'on') {
          this.tetris.music.play();
        }
      }
    },
    //「タイトル画面へ戻る」ボタンの処理
    onClicBackTitle() {
      cancelAnimationFrame(this.animationId);
      this.tetris.music.stop();
      this.$router.push({ name: 'TitleView' });

      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
    onBtnKeyLeft() {
      this.tetris.moveMino(-1, 0);
    },
    onBtnKeyRight() {
      this.tetris.moveMino(1, 0);
    },
    onBtnKeyDown() {
      this.tetris.moveMino(0, 1);
    },
    onBtnKeyRotateRight() {
      this.tetris.moveMino(0, 0, true, true);
    },
    onBtnKeyRotateLeft() {
      this.tetris.moveMino(0, 0, true, false);
    },
  },
});
</script>

<style scoped lang="scss">
.game-wrapper {
  display: flex;
  justify-content: center;
}

.game-top {
  width: 310px;
}

.game-view {
  display: flex;
  justify-content: center;
  margin-top: 6px;
  margin-bottom: 15px;

  .next-area {
    margin-left: 20px;
  }
  .stop-button {
    margin-top: 20px;
    width: 90px;
  }
}

.next-socre-wrapper {
  margin-left: 10px;
  text-align: center;
}
.tag-level {
  margin: 40px 0 4px 1px;
  background-color: pink;
  // width: 300px;
}

.tag-line {
  margin: 30px 0 4px 1px;
  background-color: pink;
  // width: 300px;
}

.tag-score {
  margin: 30px 0 4px 1px;
  background-color: pink;
  // width: 300px;
}

.key-left,
.key-right {
  font-size: 20px;
  width: 60px;
}

.key-down {
  font-size: 20px;
  width: 140px;
  margin-top: 14px;
}

.key-wrapper {
  display: flex;
  justify-content: space-between;
}

.key-left-right-wrapper {
  display: flex;
  justify-content: space-between;
}

.key-left-rotate {
  width: 60px;
  height: 60px;
  font-size: 20px;
  border-radius: 40%;
}

.key-right-rotate {
  width: 60px;
  height: 60px;
  font-size: 20px;
  margin-left: 20px;
  border-radius: 40%;
}
</style>
