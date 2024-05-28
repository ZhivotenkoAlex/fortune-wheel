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
        :gridItem="item as any"
        :size="size"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, watch } from "vue";
import WheelGrid from "./WheelGrid.vue";

// Define component props and emits
const props = defineProps({
  size: { type: String, required: true, default: "100px" },
  gridData: { type: Array, required: true, default: () => [] },
  resultIndex: { type: Number, default: 1 },
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "onEnd"]);
const currentRotateDeg = ref(0);

// Compute the skewY angle for each wheel grid item
const gridSkewY = computed(() => {
  return 90 - 360 / props.gridData.length;
});

// Compute the rotation angle for each wheel grid item
const gridRotate = computed(() => {
  return 360 / props.gridData.length;
});

// Compute the style for the fortuneWheel container
const wheelContainerStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
    transition: "all 3s",
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
  if (currentRotateDeg.value === 0) {
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
  let newRotateDeg =
    clearRotateDeg +
    3600 -
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
