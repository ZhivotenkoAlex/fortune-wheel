<template>
  <div class="wheelGrid" :style="GridStyle">
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

const props = defineProps({
  skewY: { type: Number, required: true },
  rotate: { type: Number, required: true },
  gridItem: { type: Object, required: true, default: () => {} },
  size: { type: String, required: true, default: "100px" },
});
/*
  Grid style
*/
const GridStyle = computed(() => {
  let itemRotate = props.rotate;
  let itemSkewY = props.skewY;
  let gridTransform = `rotate(${itemRotate}deg) skewY(${-1 * itemSkewY}deg)`;
  let bgColor = `#${props.gridItem.bgColor}`;
  let fontColor = `#${props.gridItem.fontColor}`;
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
*/
const itemContainerStyle = computed(() => {
  let itemSkewY = props.skewY;
  let contentSkewY = itemSkewY;
  let contentRotate = (90 - itemSkewY) / 2;
  let itemContentTransform = `skewY(${contentSkewY}deg) rotate(${contentRotate}deg)`;

  return {
    transform: itemContentTransform,
    width: props.size,
    height: props.size,
  };
});

/*
  GridItem-Base style
*/
const itemBaseStyle = computed(() => {
  let stringIndex = props.size.indexOf("px");
  let extractNumber = props.size.slice(0, stringIndex + 1);
  let baseSize = parseInt(extractNumber) / 2;
  return { width: `${baseSize}px`, height: `${baseSize}px` };
});
</script>

<style scoped>
.wheelGrid {
  position: absolute;
  transform-origin: 0 100%;
}

.gridItem-Container {
  position: absolute;
  top: 50%;
  right: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.gridItem-Base {
  position: absolute;
  display: flex;
  justify-content: stretch;
  align-items: center;
  padding-left: 10px;
  transform: rotate(90deg);
}
.gridItem-Image {
  transform: rotate(90deg);
  margin-left: 25px;
}
</style>
