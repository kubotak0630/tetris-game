<template>
  <div
    class="cell"
    v-bind:class="{
      'cyan-cell': isCyan,
      'yellow-cell': isYellow,
      'green-cell': isGreen,
      'red-cell': isRed,
      'blue-cell': isBlue,
      'orange-cell': isOrange,
      'magenta-cell': isMagenta,
      'wall-cell': isWall,
      'shadow-cell': isShadow,
      'field-cell': isField,   //FieldとNext領域でサイズを変える
      'next-cell': !isField,   //FieldとNext領域でサイズを変える
    }"
  ></div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Cell from '../cell';

export default Vue.extend({
  name: 'VCell',
  props: {
    cell: {
      type: Object as PropType<Cell>,
      required: true,
    },
    isField: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isWall(): boolean {
      return this.cell.cellState === 'Wall';
    },
    isCyan(): boolean {
      return this.cell.cellState === 'Cyan';
    },
    isYellow(): boolean {
      return this.cell.cellState === 'Yellow';
    },
    isGreen(): boolean {
      return this.cell.cellState === 'Green';
    },
    isRed(): boolean {
      return this.cell.cellState === 'Red';
    },
    isBlue(): boolean {
      return this.cell.cellState === 'Blue';
    },
    isOrange(): boolean {
      return this.cell.cellState === 'Orange';
    },
    isMagenta(): boolean {
      return this.cell.cellState === 'Magenta';
    },
    isShadow(): boolean {
      return this.cell.cellState === 'Shadow';
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.field-cell {
  width: 20px;
  height: 20px;
  background-color: #180532;
  // border: 1px solid gray;
  border: 1px solid #382552;
  // border: 1px solid #180532;
  margin: 0 -1px -1px 0;
  // margin: 0 -1px -1px 0;
  // box-sizing: border-box;
}

.next-cell {
  width: 14px;
  height: 14px;
  background-color: #180532;
  // border: 1px solid gray;
  border: 1px solid #180532;
  // border: 1px solid #180532;
  margin: 0 -1px -1px 0;
  // margin: 0 -1px -1px 0;
  // box-sizing: border-box;
}

.cyan-cell {
  background-color: cyan;
}

.yellow-cell {
  background-color: #fff200;
}

.green-cell {
  background-color: #33cc00;
}

.red-cell {
  background-color: #e0003c;
}

.blue-cell {
  background-color: #0652dd;
}

.orange-cell {
  background-color: #f06020;
}

.magenta-cell {
  background-color: #a03edd;
}
.wall-cell {
  background-color: gray;
}

.shadow-cell {
  background: linear-gradient(to right, #483562, #786592);
  margin: 0 -1px -1px 0;
}
</style>
