<template>
  <div class="container">
    <div class="header"></div>
    <div class="wheel_container">
      <!-- First FortuneWheelVue component -->
      <FortuneWheelVue
        v-model="startRotate"
        :resultIndex="computedResultIndex"
        :gridData="computedGridData"
        :size="wheelSize"
        @onEnd="onEnd"
      ></FortuneWheelVue>
      <!-- Start button -->
      <ButtonUi id="start" @click="start">{{ buttonLabel }}</ButtonUi>
      <!-- Second FortuneWheelVue component -->
      <FortuneWheelVue
        v-model="startRotate"
        :resultIndex="computedSecondResultIndex"
        :gridData="computedGridData"
        :size="wheelSize"
        @onEnd="onEnd"
        transitionTime="5s"
        direction="counterclockwise"
      ></FortuneWheelVue>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, type Ref, onMounted, onUnmounted } from "vue";
import FortuneWheelVue from "./components/FortuneWheel.vue";
import ButtonUi from "./components/StartButton.vue";
import { state } from "./socket";
import { socket } from "./socket";
import { isEmpty } from "./helpers";

// Define reactive variables using ref()
const gridData: Ref<any> = ref([]);
const resultIndex = ref(1);
const secondResultIndex = ref(0);
const startRotate = ref(false);
const windowWidth = ref(window.innerWidth);
const buttonLabel = computed(() => (startRotate.value ? "Stop" : "Start"));

// Function to start the wheel
const start = () => {
  socket.disconnect();
  resultIndex.value = state.gridData.resultIndex;
  secondResultIndex.value = state.gridData.resultIndex;
  gridData.value = state.gridData.gridData;
  startRotate.value = !startRotate.value;
};

// Function to handle the end of the wheel rotation
const onEnd = () => {
  console.log("end");
  // socket.connect();
};

// Computed properties
const computedGridData = computed(() => gridData.value);
const computedResultIndex = computed(() => resultIndex.value);
const computedSecondResultIndex = computed(() => secondResultIndex.value);

// Watch for changes in the state object
watch(state, (newState) => {
  gridData.value = isEmpty(newState.gridData.gridData)
    ? []
    : [...newState!.gridData!.gridData];
  resultIndex.value = newState.gridData.resultIndex;
  secondResultIndex.value = newState.gridData.resultIndex;
});
const onResize = () => {
  windowWidth.value = window.innerWidth;
};
onMounted(() => {
  window.addEventListener("resize", onResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  socket.disconnect();
});
const wheelSize = computed(() => {
  if (windowWidth.value > 800) {
    return "350px";
  } else {
    return "200px";
  }
});
</script>

<style scoped>
.container {
  overflow: hidden;
  border: 1px solid grey;
  border-radius: 20px;
}
.header {
  background-color: #01549d;
  height: 50px;
  width: 100%;
}
.wheel_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
