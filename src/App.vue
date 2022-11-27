<template>
  <div
    style="
      width: 300px;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    "
  >
    <FortuneWheelVue
      v-model="startRotate"
      :resultIndex="resultIndex"
      :gridData="gridData"
      size="200px"
      @onEnd="onEnd"
    ></FortuneWheelVue>
    <div
      style="
        position: absolute;
        width: 50px;
        height: 50px;
        background-color: black;
        z-index: 1000;
      "
    ></div>
  </div>
  <button @click="start">click</button>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import FortuneWheelVue from "./components/FortuneWheel.vue";

const gridData: Ref<any> = ref([]);
const resultIndex = ref(1);
const startRotate = ref(false);
for (let index = 1; index <= 8; index++) {
  if (index % 2 == 0)
    gridData.value.push({
      text: `獎品${index}`,
      bgColor: "5E5A54",
      fontColor: "FFE4B8",
    });
  else {
    gridData.value.push({
      text: `獎品${index}`,
      bgColor: "FFE4B8",
      fontColor: "5E5A54",
    });
  }
}
const start = () => {
  resultIndex.value = 5;
  startRotate.value = true;
};
const onEnd = () => {
  console.log("end");
};
</script>

<style scoped></style>
