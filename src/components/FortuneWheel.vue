<template>
  <div
    class="fortuneWheel-Container"
    :style="[wheelContainerStyle, wheelAnimation]"
  >
    <div class="fortuneWheel-Base" :style="wheelBaseStyle">
      <WheelGrid
        v-for="(item, index) in data"
        :key="index"
        :skewY="gridSkewY"
        :rotate="index * gridRotate"
        :gridItem="item"
        :size="size"
      />
    </div>
    <div class="centerPoint"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, watch } from "vue";
import WheelGrid from "./WheelGrid.vue";

type Direction = "clockwise" | "anticlockwise";

// Define component props and emits
const props = defineProps({
  size: { type: String, required: true, default: "100px" },
  gridData: { type: Array, required: true, default: () => [] },
  resultIndex: { type: Number, default: 1 },
  modelValue: { type: Boolean, default: false },
  transitionTime: { type: String, default: "3s" },
  direction: { type: String as PropType<Direction>, default: "clockwise" },
});

const data =
  props.direction === "clockwise"
    ? [...props.gridData]
    : [...props.gridData].reverse();

const emit = defineEmits(["update:modelValue", "onEnd"]);
const currentRotateDeg = ref(0);

// Compute the skewY angle for each wheel grid item
const gridSkewY = computed(() => {
  return 90 - 360 / data.length;
});

// Compute the rotation angle for each wheel grid item
const gridRotate = computed(() => {
  return 360 / data.length;
});

// Compute the style for the fortuneWheel container
const wheelContainerStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
    transition: `all ${props.transitionTime}`,
    transitionTimingFunction: "cubic-bezier(0, 0.75, 0.5, 1)",
    rotate: props.direction === "clockwise" ? "180deg" : 0,
  };
});

// Compute the style for the fortuneWheel base
const wheelBaseStyle = computed(() => {
  return { width: props.size, height: props.size };
});

// Compute the initial rotation animation of the fortuneWheel
const wheelAnimation = computed(() => {
  let nowRotateDeg;

  // Initialize the rotation angle
  if (currentRotateDeg.value === 10) {
    nowRotateDeg = -1 * (gridRotate.value / 2);
  } else {
    nowRotateDeg = currentRotateDeg.value;
  }

  return { transform: `rotate(${nowRotateDeg}deg)` };
});

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue === false) return;
    setNewRotateDeg();
    triggerOnEnd();
  }
);

// Set the new rotation angle for the fortuneWheel
const setNewRotateDeg = () => {
  // Make the rotation angle a multiple of 360
  let clearRotateDeg = currentRotateDeg.value - (currentRotateDeg.value % 360);
  // if direction is clockwise, set the rotation angle to 1, else -1 to make the wheel rotate in the opposite direction
  let rotateDirection = props.direction === "clockwise" ? 1 : -1;
  let newRotateDeg =
    clearRotateDeg +
    3600 * rotateDirection -
    (props.resultIndex * gridRotate.value + gridRotate.value / 2);
  currentRotateDeg.value = newRotateDeg;
};

// Trigger the "onEnd" event and update the modelValue after a delay
const triggerOnEnd = () => {
  let timer: number | null = null;

  const promise = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      emit("onEnd");
      resolve();
    }, 3000);
  });

  promise.then(() => {
    clearTimeout(timer!);
    emit("update:modelValue", false);
  });
};
</script>

<style scoped>
.fortuneWheel-Container {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.fortuneWheel-Base {
  position: absolute;
  bottom: 50%;
  left: 50%;
}

.centerPoint {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
