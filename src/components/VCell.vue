<template>
  <div
    class="cell"
    v-bind:class="{
      'none-cell': isNone,
      'cyan-cell': isCyan,
      'yellow-cell': isYellow,
      'green-cell': isGreen,
      'red-cell': isRed,
      'blue-cell': isBlue,
      'orange-cell': isOrange,
      'magenta-cell': isMagenta,
      'wall-cell': isWall,
      'shadow-cell': isShadow, //落下地点の影
      'bingo-cell': isBingo,
      'field-cell': isField, //FieldとNext領域でサイズを変える
      'next-cell': !isField, //FieldとNext領域でサイズを変える
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
    isNone(): boolean {
      return this.cell.cellState === 'None';
    },
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
    isBingo(): boolean {
      return this.cell.cellState === 'Bingo';
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.field-cell {
  width: 21px;
  height: 21px;
}

.next-cell {
  width: 15px;
  height: 15px;
}

.none-cell {
  background-color: #180532;
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

// 消えるときのエフェクト
.bingo-cell {
  transition: all 200ms 0s linear;
  transform: scaleY(0);
}

.shadow-cell {
  background: linear-gradient(to right, #483562, #786592);
  margin: 0 -1px -1px 0;
}
</style>
