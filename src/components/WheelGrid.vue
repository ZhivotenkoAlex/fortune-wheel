<template>
  <div class="wheelGrid" :style="gridStyle">
    <div class="gridItem-Container" :style="itemContainerStyle">
      <div class="gridItem-Base" :style="itemBaseStyle">
        {{ gridItem.text }}
        <img class="gridItem-Image" width="50" height="100" :src="image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { state } from "../socket";
import { images } from "@/helpers";

const props = defineProps({
  rotate: { type: Number, required: true },
  gridItem: { type: Object, required: true, default: () => {} },
  size: { type: String, required: true, default: "100px" },
});

const image = images[props.gridItem.image];

const gridStyle = computed(() => {
  const itemRotate = props.rotate;
  const itemSkewY = state.data.gridSkewY;
  const gridTransform = `rotate(${itemRotate}deg) skewY(${-1 * itemSkewY}deg)`;
  const bgColor = props.gridItem.bgColor;
  const fontColor = props.gridItem.fontColor;
  return {
    transform: gridTransform,
    width: props.size,
    height: props.size,
    backgroundColor: bgColor,
    color: fontColor,
  };
});

const itemContainerStyle = computed(() => {
  const itemSkewY = state.data.gridSkewY;
  const contentSkewY = itemSkewY;
  const contentRotate = (90 - itemSkewY) / 2;
  const itemContentTransform = `skewY(${contentSkewY}deg) rotate(${contentRotate}deg)`;

  return {
    transform: itemContentTransform,
    width: props.size,
    height: props.size,
  };
});

const itemBaseStyle = computed(() => {
  const stringIndex = props.size.indexOf("px");
  const extractNumber = props.size.slice(0, stringIndex + 1);
  const baseSize = parseInt(extractNumber) / 2;
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
  gap: 5px;
}

.gridItem-Image {
  transform: rotate(90deg);
  margin-left: 5px;
  height: 65px;
  width: 45px;
  object-fit: cover;
  @media screen and (min-width: 768px) {
    height: 60%;
    width: auto;
    object-fit: cover;
  }
}
</style>
