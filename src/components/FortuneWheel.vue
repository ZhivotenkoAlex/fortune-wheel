<template>
  <div
    class="fortuneWheel-Container"
    :style="wheelContainerStyle"
    ref="wheelRef"
  >
    <div class="fortuneWheel-Base" :style="wheelBaseStyle">
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
import { computed, defineProps, defineEmits, ref, watch } from "vue";
import WheelGrid from "./WheelGrid.vue";
import { socket, state } from "../socket";

const props = defineProps({
  size: { type: String, required: true, default: "100px" },
  modelValue: { type: Boolean, default: false },
  direction: { type: String, default: "clockwise" },
});

const isClockwise = ref(props.direction === "clockwise");

const wheelRef = ref(null) as any;

const data = computed(() => {
  const data = state.data?.items ?? [];
  return isClockwise.value ? [...data] : [...data].reverse();
});

let animationFrameId = null as any;

// Define the emits for the component
const emit = defineEmits(["update:modelValue", "onEnd"]);

// Use a ref to track the current rotation angle
const currentRotateDeg = ref(0);

// Compute the rotation angle for each wheel grid item
const gridRotate = computed(() => state.data.gridRotate);

const animateRotation = () => {
  // Update the wheel's rotation
  if (wheelRef.value) {
    wheelRef.value.style.transform = `rotate(${currentRotateDeg.value}deg)`;
  }

  // Request the next animation frame
  animationFrameId = window.requestAnimationFrame(animateRotation);
};

const startRotation = () => {
  const rotationEvent = isClockwise.value
    ? "wheelRotation"
    : "negativeWheelRotation";
  socket.on(rotationEvent, (angle) => {
    currentRotateDeg.value = angle;
  });
  animationFrameId = window.requestAnimationFrame(animateRotation);
};

const stopRotation = () => {
  const rotationEvent = isClockwise.value
    ? "wheelRotation"
    : "negativeWheelRotation";
  socket.off(rotationEvent);
  window.cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  triggerOnEnd();
};

// Trigger the "onEnd" event and update the modelValue after a delay
const triggerOnEnd = () => {
  let timer: number | null | NodeJS.Timeout = null;

  const promise = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      emit("onEnd");
      resolve();
    }, 1000);
  });

  promise.then(() => {
    clearTimeout(timer!);
    emit("update:modelValue", false);
  });
};

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue === true) {
      startRotation();
    } else {
      stopRotation();
      storeRotationDeg();
    }
  }
);

// Watch the direction prop and update isClockwise when it changes
watch(props, (newProps) => {
  isClockwise.value = newProps.direction === "clockwise";
});

const storeRotationDeg = () => {
  if (isClockwise.value) {
    state.firstFinishDegree = currentRotateDeg.value;
  } else {
    state.secondFinishDegree = currentRotateDeg.value;
  }
};

// Compute the styles
const wheelContainerStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
    rotate: isClockwise.value ? "180deg" : "0deg",
  };
});

const wheelBaseStyle = computed(() => {
  return { width: props.size, height: props.size };
});
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
