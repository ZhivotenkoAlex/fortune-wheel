<template>
  <div
    id="fortuneWheel-Container"
    :style="[wheelContainerStyle, wheelAnimation]"
  >
    <div id="fortuneWheel-Base" :style="wheelBaseStyle">
      <WheelGrid
        v-for="(item, index) in gridData"
        :key="index"
        :skewY="gridSkewY"
        :rotate="index * gridRotate"
        :gridItem="item"
        :size="size"
      />
    </div>
  </div>
</template>
<!-- fortuneWheel-Container 輪盤最外層，用於控制整個輪盤大小 
     fortuneWheel-Base 輪盤內容物的基準點
     wheelItem 內容物，根據有多少內容物調整角度
     wheelItemContent 實際內容存放處，內容物要在item致中
-->

<script setup lang="ts">
import { computed, type Ref, ref, watch } from "vue";
import WheelGrid from "./WheelGrid.vue";

const props = defineProps({
  size: { type: String, required: true, default: "100px" },
  gridData: { type: Array, required: true, default: () => [] },
  resultIndex: { type: Number, default: 1 },
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "onEnd"]);
const currentRotateDeg: Ref<number> = ref(0);
/*
wheelGrid 內角公式(skewY) : 90 - 360 / item 個數
*/
const gridSkewY = computed(() => {
  return 90 - 360 / props.gridData.length;
});
/*
wheelGrid 旋轉角度
*/
const gridRotate = computed(() => {
  return 360 / props.gridData.length;
});
/*
 fortuneWheel 樣式
*/
const wheelContainerStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
    transition: "all 3s",
  };
});
/*
 fortuneWheel-Base 樣式
*/
const wheelBaseStyle = computed(() => {
  return { width: props.size, height: props.size };
});
/*
 fortuneWheel 開始時的旋轉動畫
*/
const wheelAnimation = computed(() => {
  let nowRotateDeg;
  // init RotateDeg
  if (currentRotateDeg.value === 0) nowRotateDeg = -1 * (gridRotate.value / 2);
  else nowRotateDeg = currentRotateDeg.value;
  return { transform: `rotate(${nowRotateDeg}deg)` };
});

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue === false) return;
    setNewRotateDeg();
    triggerOnEnd();
  }
);

const setNewRotateDeg = () => {
  //使 RotateDeg 初始為 3600 的倍數
  let clearRotateDeg = currentRotateDeg.value - (currentRotateDeg.value % 360);
  let newRotateDeg =
    clearRotateDeg +
    3600 -
    (props.resultIndex * gridRotate.value + gridRotate.value / 2);
  currentRotateDeg.value = newRotateDeg;
};
const triggerOnEnd = () => {
  let timer: any = null;

  const promise = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      emit("onEnd");
      resolve();
    }, 3000);
  });
  promise.then(() => {
    clearTimeout(timer);
    emit("update:modelValue", false);
  });
};
</script>
<style scoped>
#fortuneWheel-Container {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}
#fortuneWheel-Base {
  position: absolute;
  bottom: 50%;
  left: 50%;
}
</style>
