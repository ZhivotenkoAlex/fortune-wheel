<template>
  <div
    class="fortuneWheel-Container"
    :style="[wheelContainerStyle, wheelAnimation]"
  >
    <div class="fortuneWheel-Base" :style="wheelBaseStyle">
      <!-- Iterate over the gridData and render WheelGrid component for each item -->
      <WheelGrid
        v-for="(item, index) in gridData"
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
import { socket, state, type Data } from "../socket";

// Define component props and emits
const props = defineProps({
  size: { type: String, required: true, default: "100px" },
  gridData: { type: Array<Data>, required: true, default: () => [] },
  resultIndex: { type: Number, default: 1 },
  modelValue: { type: Boolean, default: false },
  direction: { type: String, default: "clockwise" },
});

// Define isClockwise as a ref
const isClockwise = ref(props.direction === "clockwise");
const transitionTime = ref("0.3s");

// Compute the data based on the direction prop
const gridData = computed(() => {
  const data = [...props.gridData];
  return isClockwise.value ? data : [...data].reverse();
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
    transition: `all ${transitionTime.value}`,
    transitionTimingFunction: "cubic-bezier(0, 0.75, 0.5, 1)",
    rotate: isClockwise.value ? "180deg" : "0deg",
  };
});

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
  const rotationEvent = isClockwise.value
    ? "wheelRotation"
    : "negativeWheelRotation";
  socket.on(rotationEvent, (angle) => {
    currentRotateDeg.value = angle;
  });
};

// Function to stop the wheel rotation
const stopRotation = () => {
  window.requestAnimationFrame(() => {
    transitionTime.value = "0,3s";
    const rotationEvent = isClockwise.value
      ? "wheelRotation"
      : "negativeWheelRotation";
    socket.off(rotationEvent);
  });

  triggerOnEnd();
};

// Trigger the "onEnd" event and update the modelValue after a delay
const triggerOnEnd = () => {
  let timer: number | null | NodeJS.Timeout = null;

  const promise = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      emit("onEnd");
      resolve();
    }, 2000);
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
      storeResult();
    }
  }
);

// Watch the direction prop and update isClockwise when it changes
watch(props, (newProps) => {
  isClockwise.value = newProps.direction === "clockwise";
});

// Function to store the result based on the rotation direction
const storeResult = () => {
  if (isClockwise.value) {
    socket.emit("getFirstFinishIndex", {
      rotateDeg: currentRotateDeg.value,
      isClockwise: true,
      gridRotate: gridRotate.value,
    });
    socket.once("firstFinishIndex", (index) => {
      state.FirstWheelResult = props.gridData[index] as any;
    });
  } else {
    socket.emit("getSecondFinishIndex", {
      rotateDeg: currentRotateDeg.value,
      isClockwise: false,
      gridRotate: gridRotate.value,
    });
    socket.once("secondFinishIndex", (index) => {
      state.SecondWheelResult = props.gridData[index] as any;
    });
  }
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
