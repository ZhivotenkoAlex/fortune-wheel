<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">x</span>
      <div class="container">
        <div class="description">
          <p>Result of the first wheel is {{ firstWheelResult ?? "" }}</p>

          <p>Result of the second wheel is {{ secondWheelResult ?? "" }}</p>
        </div>
        <div>
          <img v-if="isWinner" class="image" width="100" :src="image" />
        </div>
      </div>
      <p class="result_text">{{ content }}</p>
      <p class="description" v-if="isWinner">
        Yor prize type is {{ prizeType ?? "" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, watch } from "vue";
import { state } from "@/socket";
import { socket } from "../socket";
import { images } from "@/helpers";

let firstWheelResult: any,
  secondWheelResult: any,
  isWinner: any,
  prizeType: any,
  resultItem: any;

const image = computed(() => {
  let image = "";
  if (isWinner) {
    image =
      prizeType === "A" ? images[resultItem.image as string] : images["prize"];
  }
  return image;
});

// Define the emit function to emit events
const emit = defineEmits(["update:showModal"]);

let content: string;

defineProps({
  showModal: Boolean,
});

watch(
  () => state.gameResult,
  (newVal) => {
    if (newVal) {
      ({
        firstWheelResult,
        secondWheelResult,
        isWinner,
        prizeType,
        resultItem,
      } = newVal);
      content = isWinner ? "You are a winner!" : "Luck next time!";
    }
  }
);

const closeModal = () => {
  emit("update:showModal", false);
  state.gameResult = {};
  let start = Date.now();

  socket.emit("ping", () => {
    const duration = Date.now() - start;
    state.ping = duration;
  });
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 10px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.image {
  margin-left: 20px;
  width: 200px;
}

.description {
  text-align: center;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  right: 10px;
  top: 0;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.result_text {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
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
