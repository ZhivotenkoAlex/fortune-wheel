<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <!-- Close button -->
      <span class="close-button" @click="closeModal">x</span>

      <!-- Display the result of the first wheel -->
      <p>Result of the first wheel is {{ firstWheel?.text }}</p>

      <!-- Display the result of the second wheel -->
      <p>Result of the second wheel is {{ secondWheel?.text }}</p>

      <!-- Display the result text based on the comparison of the two wheels -->
      <p class="result_text">{{ resultText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { state } from "@/socket";
import { socket } from "../socket";

// Compute the result of the first wheel
const firstWheel = computed(() => state.FirstWheelResult);

// Compute the result of the second wheel
const secondWheel = computed(() => state.SecondWheelResult);

// Compute whether the player is a winner or not
const isWinner = computed(() => {
  return firstWheel.value?.text === secondWheel.value?.text;
});

// Define the emit function to emit events
const emit = defineEmits(["update:showModal", "onEnd"]);

// Compute the result text based on the comparison of the two wheels
const resultText = computed(() => {
  const content = isWinner.value ? "You are a winner!" : "Try again!";

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
  socket.connect();
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
