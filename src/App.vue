<template>
  <!-- Header component -->
  <HeaderUI />

  <div class="root">
    <div class="container">
      <div v-if="!isLoaded" class="loader"></div>
      <div v-else class="wheel_container">
        <!-- First FortuneWheelVue component -->
        <FortuneWheelVue
          v-model="startRotate"
          :size="wheelSize"
          @onEnd="onEnd"
        ></FortuneWheelVue>

        <!-- Start button -->
        <ButtonUi id="start" @click="start">{{ buttonLabel }} </ButtonUi>

        <!-- Second FortuneWheelVue component -->
        <FortuneWheelVue
          v-model="startRotate"
          :size="wheelSize"
          @onEnd="onEnd"
          direction="counterclockwise"
        ></FortuneWheelVue>

        <!-- ModalView component -->
        <ResultModal
          :showModal="showModal"
          @update:showModal="showModal = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, type Ref, onMounted, onUnmounted } from "vue";
import FortuneWheelVue from "./components/FortuneWheel.vue";
import ButtonUi from "./components/StartButton.vue";
import ResultModal from "./components/ResultModal.vue";
import HeaderUI from "./components/HeaderUI.vue";
import { state } from "./socket";
import { socket } from "./socket";
import { isEmpty, images } from "./helpers";

// Define reactive variables using ref()
const gridData: Ref<any> = ref([]);
const isLoaded = ref(false);

const startRotate = ref(false);
const windowWidth = ref(window.innerWidth);
const showModal = ref(false);

// Computed property for button label
const buttonLabel = computed(() => (startRotate.value ? "Stop" : "Start"));

// Function to start the wheel
const start = () => {
  socket.off("getData");
  socket.emit("startRotation");
  gridData.value = state.gridData.gridData;
  startRotate.value = !startRotate.value;
};

// Function to handle the end of the wheel rotation
const onEnd = () => {
  showModal.value = true;
  socket.emit("pauseRotation");
};

// Watch for changes in the state object
watch(state, (newState) => {
  gridData.value = isEmpty(newState.gridData.gridData)
    ? []
    : [...newState!.gridData!.gridData];

  let imagePromises = [] as any;

  if (
    newState.gridData?.gridData &&
    Array.isArray(newState.gridData?.gridData)
  ) {
    imagePromises = newState.gridData.gridData.map((item) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = images[item.image];
        img.onload = resolve;
        img.onerror = reject;
      });
    });
  }

  Promise.all(imagePromises)
    .then(() => {
      isLoaded.value = true;
    })
    .catch((error) => {
      console.error("Error loading images:", error);
    });
});

// Function to handle window resize
const onResize = () => {
  windowWidth.value = window.innerWidth;
};

// Add event listeners on component mount
onMounted(() => {
  window.addEventListener("resize", onResize);
});

// Remove event listeners on component unmount
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  socket.disconnect();
});

// Computed property for wheel size
const wheelSize = computed(() => {
  if (windowWidth.value > 768) {
    return "350px";
  } else {
    return "250px";
  }
});
</script>

<style scoped>
.root {
  overflow: hidden;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

.wheel_container {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
