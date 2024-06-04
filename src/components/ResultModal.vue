<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <!-- Close button -->
      <span class="close-button" @click="closeModal">x</span>
      <div class="container">
        <div class="description">
          <!-- Display the result of the first wheel -->
          <p>Result of the first wheel is {{ firstWheel?.text ?? "" }}</p>

          <!-- Display the result of the second wheel -->
          <p>Result of the second wheel is {{ secondWheel?.text ?? "" }}</p>
        </div>
        <div>
          <img v-if="isWinner" class="image" width="100" :src="image" />
        </div>
      </div>
      <!-- Display the result text based on the comparison of the two wheels -->
      <p class="result_text">{{ resultText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { state } from "@/socket";
import { socket } from "../socket";
import dairy_milk from "../assets/dairy_milk.png";
import rice_cake from "../assets/rice_cake.png";
import truffle_lindt from "../assets/truffle_lindt.png";

const images: Record<string, string> = {
  dairy_milk: dairy_milk,
  rice_cake: rice_cake,
  truffle_lindt: truffle_lindt,
};

// Compute the result of the first wheel
const firstWheel = computed(() => {
  const firstWheelIndex = state.firstWheelResult;
  const result =
    firstWheelIndex !== null ? state.gridData.gridData[firstWheelIndex] : null;
  return result;
});

// Compute the result of the second wheel
const secondWheel = computed(() => {
  const secondWheelIndex = state.secondWheelResult;
  const result =
    secondWheelIndex !== null
      ? state.gridData.gridData[secondWheelIndex]
      : null;
  return result;
});

const image = computed(() => {
  return images[firstWheel.value?.image as string];
});

// Compute whether the player is a winner or not
const isWinner = computed(() => {
  return state.firstWheelResult === state.secondWheelResult;
});

// Define the emit function to emit events
const emit = defineEmits(["update:showModal", "onEnd"]);

// Compute the result text based on the comparison of the two wheels
const resultText = computed(() => {
  const content = isWinner.value ? "You are a winner!" : "Luck next time!";

  // Only display the result text if both wheels have a result
  return firstWheel.value?.text && secondWheel.value?.text ? content : "";
});

// Define showModal as a prop
defineProps({
  showModal: Boolean,
});

// Function to close the modal
const closeModal = () => {
  emit("update:showModal", false);
  let start = Date.now();
  socket.emit("updateData");
  socket.once("getData", (data: any) => {
    state.gridData = data;
    start = Date.now();

    socket.emit("ping", () => {
      const duration = Date.now() - start;
      state.ping = duration;
    });
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
</style>
