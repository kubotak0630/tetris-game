<template>
  <div class="top-container">
    <div class="title">
      <h1>Tetris Game</h1>

      <div class="setting music-select">
        <span class="text-label">Music</span>
        <el-radio-group v-model="radioMusic">
          <el-radio-button label="on">ON</el-radio-button>
          <el-radio-button label="off">OFF</el-radio-button>
        </el-radio-group>
        <hr class="hr01" />
      </div>

      <div class="setting vibrate-select">
        <span class="text-label">Vibration</span>
        <el-radio-group v-model="radioVibration">
          <el-radio-button label="on">ON</el-radio-button>
          <el-radio-button label="off">OFF</el-radio-button>
        </el-radio-group>
        <hr class="hr01" />
      </div>

      <el-button class="start-button" type="primary" @click="onStartClick">Play Start</el-button>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import screenfull from 'screenfull';

export default Vue.extend({
  name: 'TitleView',
  components: {},
  data() {
    return {
      radioMusic: 'off',
      radioVibration: 'on',
    };
  },

  methods: {
    onStartClick() {
      // ipadは全画面表示にしない。スマホのみ全画面表示
      if (document.documentElement.clientWidth < 500) {
        if (screenfull.isEnabled) {
          //fullスクリーン処理が完了してからページ切り替え
          screenfull.request().then(() => {
            this.$router.push({
              name: 'Game',
              params: { isPlyaMusic: this.radioMusic, isVibration: this.radioVibration },
            });
          });
        }
      } else {
        this.$router.push({
          name: 'Game',
          params: { isPlyaMusic: this.radioMusic, isVibration: this.radioVibration },
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
.top-container {
  // text-align: center;
  display: flex;
  justify-content: center;
}

.title {
  text-align: center;

  .setting {
    width: 240px;
    .text-label {
      text-align: left;
      display: inline-block;
      width: 90px;
    }

    .hr01 {
      height: 0;
      padding: 0;
      border: 0;
      // width: 240px;
      height: 10px;
      box-shadow: 0 5px 5px -5px #bbb inset;
    }
  }

  .start-button {
    margin-top: 20px;
    height: 80px;
    width: 212px;
    font-size: 24px;
  }
}
</style>
