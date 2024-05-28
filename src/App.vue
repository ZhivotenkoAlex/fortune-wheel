<template>
  <div
    style="
      width: 400px;
      height: 400px;
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
      size="400px"
      @onEnd="onEnd"
    ></FortuneWheelVue>
    <div
      style="
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: white;
        z-index: 1000;
      "
    ></div>
  </div>
  <button @click="start">click</button>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import FortuneWheelVue from "./components/FortuneWheel.vue";
import dairy_milk from "./assets/dairy_milk.png";
import rice_cake from "./assets/rice-cake.png";
import truffle_lindt from "./assets/truffle-lindt.png";

const gridData: Ref<any> = ref([]);
const resultIndex = ref(1);
const startRotate = ref(false);
for (let index = 1; index <= 8; index++) {
  if (index % 3 == 0)
    gridData.value.push({
      text: `Prize ${index}`,
      bgColor: "9cdcf9",
      image: dairy_milk,
      fontColor: "FFE4B8",
    });
  else if (index % 2 == 0)
    gridData.value.push({
      text: `Prize ${index}`,
      image: rice_cake,
      bgColor: "00aeef",
      fontColor: "5E5A54",
    });
  else
    gridData.value.push({
      text: `Prize ${index}`,
      image: truffle_lindt,
      bgColor: "01549d",
      fontColor: "5E5A54",
    });
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
