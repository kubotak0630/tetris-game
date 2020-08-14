<template>
  <div class="title">
    <h1>Tetris Game</h1>

    <el-button class="start-button" type="primary" @click="onStartClick">Play Start</el-button>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';

export default Vue.extend({
  name: 'TitleView',
  components: {},

  methods: {
    onStartClick() {
      this.$router.push({ name: 'Game' });
    },
  },
});
</script>

<style scoped lang="scss">
.title {
  text-align: center;

  .start-button {
    height: 80px;
    width: 200px;
    font-size: 24px;
  }
}
</style>
