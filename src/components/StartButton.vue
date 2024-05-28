<template lang="">
  <button class="btn">
    <slot></slot>
  </button>
</template>
<script setup lang="ts"></script>
<style scoped>
.btn {
  padding: 10px 15px;
  background: none;
  color: #01549d;
  border: 1px solid #e668b2;
  border-radius: 10px;
  cursor: pointer;
  scale: 1;
  transition: all 0.3s;
  text-transform: uppercase;
  font-size: large;
}
.btn::before,
.btn::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}
.btn::before {
  border-width: 10px 10px 10px 0;
  border-color: transparent #e668b2 transparent transparent;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.btn::after {
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #e668b2;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.btn:hover {
  background: #01549d;
  color: #fff;
  scale: 1.1;
}
@media screen and (max-width: 1024px) {
  .btn::before {
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent #e668b2 transparent;
    bottom: 100%;
    left: 50%;
    top: unset;
    transform: translateX(-50%);
  }
  .btn::after {
    border-width: 10px 10px 0 10px;
    border-color: #e668b2 transparent transparent transparent;
    top: 100%;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>
