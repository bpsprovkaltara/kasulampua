<template>
  <router-view />
  <ToastNotification />
</template>

<script setup>
import ToastNotification from './components/ToastNotification.vue'
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
