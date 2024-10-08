<template>
  <!-- Header component -->
  <HeaderUI />

  <div class="root">
    <div class="container">
      <div v-if="!isLoaded && isValidToken === null" class="loader"></div>
      <div v-else>
        <div v-if="isValidToken === false">No Access</div>
        <div
          v-else-if="isLoaded && isValidToken === true"
          class="wheel_container"
        >
          <!-- First FortuneWheelVue component -->
          <FortuneWheelVue
            v-model="startRotate"
            :size="wheelSize"
            @onEnd="handleOnEnd"
          ></FortuneWheelVue>

          <!-- Start button -->
          <ButtonUi id="start" @click="start">{{ buttonLabel }} </ButtonUi>

          <!-- Second FortuneWheelVue component -->
          <FortuneWheelVue
            v-model="startRotate"
            :size="wheelSize"
            @onEnd="handleOnEnd"
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
import { isEmpty, images, getAccessToken, getGameId } from "./helpers";

const gridData: Ref<any> = ref([]);
const isLoaded = ref(false);
const isValidToken = ref(true);

const startRotate = ref(false);
const windowWidth = ref(window.innerWidth);
const showModal = ref(false);
const onEndCalled = ref(false);

if (isValidToken.value === null) {
  getAccessToken().then((token) => {
    socket.emit("requestTokenVerification", token);
  });
}

// Request data from the server one by one, to get companyId from the gameConfig on the backend

getGameId()
  .then((gameId) => {
    socket.emit("requestData", gameId);
  })
  .then(() => {
    socket.emit("requestCompany");
  });

const buttonLabel = computed(() => (startRotate.value ? "Stop" : "Start"));

// Function to start the wheel rotation
const start = () => {
  socket.emit("startRotation");
  gridData.value = state.gridData.gridData;
  startRotate.value = !startRotate.value;
  onEndCalled.value = false;
};

// Function to handle the end of the wheel rotation
const handleOnEnd = () => {
  if (!onEndCalled.value) {
    socket.emit("pauseRotation");
    getGameResult();
    onEndCalled.value = true;
  }
};

const getGameResult = () => {
  socket.emit(
    "gameResultRequest",
    state.firstFinishDegree,
    state.secondFinishDegree
  );
  socket.once("gameResultResponse", (result) => {
    state.gameResult = result;
  });
};

watch(state, (newState) => {
  if (newState.ping === null) {
    const start = Date.now();

    socket.emit("ping", () => {
      const duration = Date.now() - start;
      state.ping = duration;
    });
  }
});

// Watch for changes in the state object
watch(state, (newState) => {
  gridData.value = isEmpty(newState.data?.items)
    ? []
    : [...newState!.data.items];

  if (!isEmpty(newState.gameResult)) {
    showModal.value = true;
  }

  // Check if all images are loaded
  let imagePromises = [] as Promise<unknown>[];
  if (newState.data?.items && Array.isArray(newState.data.items)) {
    imagePromises = newState.data.items.map((item: any) => {
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
      isLoaded.value = false;
      console.error("Error loading images:", error);
    });
});

// Watch for changes in state.company
watch(
  () => state.company,
  (newCompany) => {
    if (newCompany.layout_font_url && newCompany.layout_font_font_type) {
      applyCustomStyles(newCompany);
    }
  },
  { immediate: true }
);

// Function to handle window resize
const onWindowResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", onWindowResize);
  // socket.once("responseTokenVerification", (result) => {
  //   isValidToken.value = result.isValid;
  //   state.userId = result.userId;

  //   if (result.isValid === false) {
  //     socket.disconnect();
  //   }
  // });

  socket.on("responseData", (data) => {
    state.data = data;
  });

  socket.on("responseCompany", (company) => {
    state.company = company;
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  socket.disconnect();
});

function applyCustomStyles(company: any) {
  const fontFamily = company.layout_font_font_type;
  const fontUrl = company.layout_font_url;
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.textContent = `
    @font-face {
      font-family: '${fontFamily}';
      src: url('${fontUrl}');
    }
    * {
      font-family: '${fontFamily}', sans-serif;
    }
  `;

  document.head.appendChild(styleElement);
}

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
