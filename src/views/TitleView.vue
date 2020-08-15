<template>
  <div class="title">
    <h1>Tetris Game</h1>

    <div class="music-select">
      <el-radio-group v-model="radioMusic">
        <el-radio-button label="on">Music ON</el-radio-button>
        <el-radio-button label="off">Music OFF</el-radio-button>
      </el-radio-group>
    </div>

    <el-button class="start-button" type="primary" @click="onStartClick">Play Start</el-button>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';

export default Vue.extend({
  name: 'TitleView',
  components: {},
  data() {
    return {
      radioMusic: 'off',
    };
  },

  methods: {
    onStartClick() {
      this.$router.push({ name: 'Game', params: { isPlyaMusic: this.radioMusic } });

      //ipadは全画面表示にしない
      if (document.documentElement.clientWidth < 500) {
        document.body.requestFullscreen();
      }
    },
  },
});
</script>

<style scoped lang="scss">
.title {
  text-align: center;

  .start-button {
    margin-top: 20px;
    height: 80px;
    width: 212px;
    font-size: 24px;
  }
}
</style>
