<template>
  <table class="next-mino-tbl">
    <tr v-for="y in areaHeight" :key="y">
      <td v-for="x in areaWidth" :key="x - 1 + (y - 1) * areaWidth">
        <VCell :cell="nextArea.getCell({ x: x - 1, y: y - 1 })" :isField="false"></VCell>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import VCell from './VCell.vue';
import NextMinoArea from '../nextMinoArea';

export default Vue.extend({
  name: 'VNextMinoArea',
  components: {
    VCell,
  },
  props: {
    nextArea: {
      type: Object as PropType<NextMinoArea>,
      required: true,
    },
  },
  data() {
    return {
      areaHeight: NextMinoArea.HEIGHT,
      areaWidth: NextMinoArea.WIDTH,
    };
  },
});
</script>

<style scoped lang="scss">
.next-mino-tbl {
  border-collapse: collapse;
  /* border: 1px solid #333; */
  td {
    border: 1px solid #382552;
    padding: 0;
  }
}
</style>
