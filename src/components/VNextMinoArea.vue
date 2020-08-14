<template>
  <div class="next-mino">
    <div class="container" v-for="y in areaHeight" :key="y">
      <VCell
        v-for="x in areaWidth"
        :key="(x-1)+(y-1)*areaWidth"
        :cell="nextArea.getCell({ x: x - 1, y: y - 1 })"
        :isField="false"
      ></VCell>
    </div>
  </div>
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
.next-mino {
  .container {
    display: flex;
    flex-direction: row;
  }
}
</style>