<template>
  <div class="container">
    <FortuneWheelVue
      v-model="startRotate"
      :resultIndex="resultIndex"
      :gridData="gridData"
      size="400px"
      @onEnd="onEnd"
    ></FortuneWheelVue>
    <ButtonUi @click="start">Start</ButtonUi>
    <FortuneWheelVue
      v-model="startRotate"
      :resultIndex="resultIndex"
      :gridData="gridData"
      size="400px"
      @onEnd="onEnd"
      transitionTime="5s"
      direction="counterclockwise"
    ></FortuneWheelVue>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import FortuneWheelVue from "./components/FortuneWheel.vue";
import ButtonUi from "./components/StartButton.vue";
import dairy_milk from "./assets/dairy_milk.png";
import rice_cake from "./assets/rice-cake.png";
import truffle_lindt from "./assets/truffle-lindt.png";

const gridData: Ref<any> = ref([]);
const resultIndex = ref(1);
const secondResultIndex = ref(0);
const startRotate = ref(false);
for (let index = 1; index <= 12; index++) {
  if (index % 3 == 0)
    gridData.value.push({
      text: `${index}`,
      bgColor: "9cdcf9",
      image: dairy_milk,
      fontColor: "5E5A54",
    });
  else if (index % 2 == 0)
    gridData.value.push({
      text: `${index}`,
      image: rice_cake,
      bgColor: "00aeef",
      fontColor: "5E5A54",
    });
  else
    gridData.value.push({
      text: `${index}`,
      image: truffle_lindt,
      bgColor: "01549d",
      fontColor: "FFE4B8",
    });
}
const start = () => {
  // index of result item
  resultIndex.value = 5;
  secondResultIndex.value = gridData.value.length - resultIndex.value;
  console.log("🚀 ~ start ~ secondResultIndex:", secondResultIndex);
  startRotate.value = true;
};
const onEnd = () => {
  console.log("end");
};
</script>

<style scoped>
.container {
  /* width: 900px;
  height: 900px; */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
}
</style>
