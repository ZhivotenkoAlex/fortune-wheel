<template>
  <div class="header">
    <div class="back-button-container">
      <button class="btn back-button" @click="goBack">
        <img class="back_icon" src="@/assets/back.png" alt="Back" />
      </button>
    </div>
    <div class="ping-container">
      <p v-if="state.ping" class="ping">Ping {{ ping }}</p>
      <div class="ping-badge" :class="{ 'high-ping': isHighPing }"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { state } from "@/socket";
import { computed } from "vue";

const ping = computed(() => state.ping + "ms");
const isHighPing = computed(() => state.ping !== null && state.ping > 200);
const goBack = () => {
  window.history.back();
};
</script>
<style scoped>
.header {
  background-color: #01549d;
  height: 50px;
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr; /* 2 columns: auto for the back button, 1fr for the ping container */
  gap: 10px;
}

.back-button-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 10px;
}

.back-button {
  background-color: #fff;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.ping-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-right: 10px;
}

.ping {
  color: white;
  font-size: 16px;
  text-align: end;
  margin-right: 10px;
}

.ping-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  transition: background-color 0.3s ease;
}

.high-ping {
  background-color: red;
}

.back_icon {
  width: 20px;
}
</style>
