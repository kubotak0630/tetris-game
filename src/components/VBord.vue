<template>
  <!-- 配列は追加や削除がないのでkeyはindexをそのまま利用 -->
  <!-- ライン消去時のために背景用のセルをもつ -->
  <table class="tbl">
    <tr v-for="y in bordHeight" :key="y">
      <td v-for="x in bordWidth" :key="x - 1 + (y - 1) * bordWidth">
        <div class="bkg-cell">
          <VCell :cell="board.getCell({ x: x - 1, y: y - 1 })" :isField="true"></VCell>
        </div>
      </td>
    </tr>
  </table>
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
.tbl {
  border-collapse: collapse;
  /* border: 1px solid #333; */
  td {
    border: 1px solid #382552;
    padding: 0;
  }
  .bkg-cell {
    width: 21px;
    height: 21px;
    background-color: #180532;
  }
}
</style>
