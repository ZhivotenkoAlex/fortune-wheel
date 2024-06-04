<template lang="">
  <div class="header">
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
</script>
<style scoped>
.header {
  background-color: #01549d;
  height: 50px;
  width: 100%;
  display: grid;
  align-items: center;
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
</style>
