<template>
  <div class="board">
    <!-- 配列は追加や削除がないのでkeyはindexをそのまま利用 -->
    <div class="container" v-for="y in bordHeight" :key="y">
      <VCell
        v-for="x in bordWidth"
        :key="(x-1)+(y-1)*bordWidth"
        :cell="board.getCell({ x: x - 1, y: y - 1 })"
        :field="true"
      ></VCell>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import VCell from './VCell.vue';
import Board, { Pos } from '../board';

export default Vue.extend({
  name: 'VBoard',
  components: {
    VCell,
  },
  props: {
    board: {
      type: Object as PropType<Board>,
      required: true,
    },
  },
  data() {
    return {
      bordHeight: Board.HEIGHT,
      bordWidth: Board.WIDTH,
    };
  },
});
</script>

<style scoped lang="scss">
.board {
  .container {
    display: flex;
    flex-direction: row;
  }
}
</style>
