<template>
  <div
    class="fortuneWheel-Container"
    :style="[wheelContainerStyle, wheelAnimation]"
  >
    <div class="fortuneWheel-Base" :style="wheelBaseStyle">
      <!-- Iterate over the gridData and render WheelGrid component for each item -->
      <WheelGrid
        v-for="(item, index) in data"
        :key="index"
        :rotate="Number(index) * gridRotate"
        :gridItem="item"
        :size="size"
      />
    </div>
    <div class="centerPoint"></div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  defineEmits,
  ref,
  watch,
  type PropType,
} from "vue";
import WheelGrid from "./WheelGrid.vue";
import { state } from "../socket";

type Direction = "clockwise" | "counterclockwise";

// Define component props and emits
const props = defineProps({
  size: { type: String, required: true, default: "100px" },
  gridData: { type: Array, required: true, default: () => [] },
  resultIndex: { type: Number, default: 1 },
  modelValue: { type: Boolean, default: false },
  transitionTime: { type: String, default: "3s" },
  direction: { type: String as PropType<Direction>, default: "clockwise" },
});

// Compute the data based on the direction prop
const data = computed(() => {
  return props.direction === "clockwise"
    ? [...props.gridData]
    : ([...props.gridData].reverse() as Record<string, any>);
});

// Define the emits for the component
const emit = defineEmits(["update:modelValue", "onEnd"]);

// Use a ref to track the current rotation angle
const currentRotateDeg = ref(0);

// Compute the rotation angle for each wheel grid item
const gridRotate = computed(() => state.gridData.gridRotate);

// Compute the style for the fortuneWheel container
const wheelContainerStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
    transition: `all ${props.transitionTime}`,
    transitionTimingFunction: "cubic-bezier(0, 0.75, 0.5, 1)",
    rotate: props.direction === "clockwise" ? "180deg" : 0,
  };
}) as any;

// Compute the style for the fortuneWheel base
const wheelBaseStyle = computed(() => {
  return { width: props.size, height: props.size };
});

// Computed property for the wheel animation
const wheelAnimation = computed(() => {
  return { transform: `rotate(${currentRotateDeg.value}deg)` };
});

// Function to start the wheel rotation
const startRotation = () => {
  const rotationInterval = setInterval(() => {
    const speed = props.direction === "clockwise" ? 300 : 200; // Change this value to adjust the speed of the rotation
    props.direction === "clockwise"
      ? (currentRotateDeg.value += speed)
      : (currentRotateDeg.value -= speed); // Change this value to adjust the speed of the rotation
  }, 100); // Change this value to adjust the frequency of the rotation

  return rotationInterval;
};

let rotationInterval: ReturnType<typeof setInterval>;

// Function to stop the wheel rotation
const stopRotation = () => {
  clearInterval(rotationInterval);
  const halfItemRotateDeg = gridRotate.value / 2;
  const stoppedAngle =
    props.direction === "clockwise"
      ? currentRotateDeg.value % 360
      : ((currentRotateDeg.value % 360) + 360) % 360;
  const adjustment = halfItemRotateDeg - (stoppedAngle % gridRotate.value);
  props.direction === "clockwise"
    ? (currentRotateDeg.value += adjustment + 360)
    : (currentRotateDeg.value -= adjustment);
  triggerOnEnd();
};

const stoppedItemIndex = computed(() => {
  // The wheel rotates clockwise, so we subtract the rotation angle from 360
  const stoppedAngle =
    props.direction === "clockwise"
      ? 360 - (currentRotateDeg.value % 360)
      : ((currentRotateDeg.value % 360) + 360) % 360;
  return Math.floor(stoppedAngle / gridRotate.value);
});

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue === true) {
      rotationInterval = startRotation();
    } else {
      stopRotation();
      console.log("🚀 ~ stoppedItemIndex.value:", stoppedItemIndex.value + 1);
      // triggerOnEnd();
    }
  }
);

// Trigger the "onEnd" event and update the modelValue after a delay
const triggerOnEnd = () => {
  let timer: number | null | NodeJS.Timeout = null;

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
