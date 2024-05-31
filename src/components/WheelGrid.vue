<template>
  <div class="wheelGrid" :style="gridStyle">
    <div class="gridItem-Container" :style="itemContainerStyle">
      <div class="gridItem-Base" :style="itemBaseStyle">
        {{ gridItem.text }}
        <img class="gridItem-Image" width="50" :src="gridItem.image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { state } from "../socket";

// Define component props
const props = defineProps({
  rotate: { type: Number, required: true },
  gridItem: { type: Object, required: true, default: () => {} },
  size: { type: String, required: true, default: "100px" },
});

/*
  Grid style
  - Computes the style for the grid element
*/
const gridStyle = computed(() => {
  const itemRotate = props.rotate;
  const itemSkewY = state.gridData.gridSkewY;
  const gridTransform = `rotate(${itemRotate}deg) skewY(${-1 * itemSkewY}deg)`;
  const bgColor = `#${props.gridItem.bgColor}`;
  const fontColor = `#${props.gridItem.fontColor}`;
  return {
    transform: gridTransform,
    width: props.size,
    height: props.size,
    backgroundColor: bgColor,
    color: fontColor,
  };
});

/*
  GridItem-Container style
  - Computes the style for the container of the grid item
*/
const itemContainerStyle = computed(() => {
  const itemSkewY = state.gridData.gridSkewY;
  const contentSkewY = itemSkewY;
  const contentRotate = (90 - itemSkewY) / 2;
  const itemContentTransform = `skewY(${contentSkewY}deg) rotate(${contentRotate}deg)`;

  return {
    transform: itemContentTransform,
    width: props.size,
    height: props.size,
  };
});

/*
  GridItem-Base style
  - Computes the style for the base of the grid item
*/
const itemBaseStyle = computed(() => {
  const stringIndex = props.size.indexOf("px");
  const extractNumber = props.size.slice(0, stringIndex + 1);
  const baseSize = parseInt(extractNumber) / 2;
  return { width: `${baseSize}px`, height: `${baseSize}px` };
});
</script>

<style scoped>
/* WheelGrid styles */
.wheelGrid {
  position: absolute;
  transform-origin: 0 100%;
}

/* GridItem-Container styles */
.gridItem-Container {
  position: absolute;
  top: 50%;
  right: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* GridItem-Base styles */
.gridItem-Base {
  position: absolute;
  display: flex;
  justify-content: stretch;
  align-items: center;
  padding-left: 10px;
  transform: rotate(90deg);
}

/* GridItem-Image styles */
.gridItem-Image {
  transform: rotate(90deg);
  margin-left: 5px;
  height: 60%;
  width: auto;
}
</style>
