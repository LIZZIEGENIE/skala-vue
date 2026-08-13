<script setup>
defineProps({
  variant: {
    type: String,
    default: 'list',
    validator: (value) => ['search', 'list'].includes(value),
  },
})
</script>

<template>
  <section class="base-dashboard-card" :class="`base-dashboard-card--${variant}`">
    <slot></slot>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  margin-bottom: 18px;
  padding: 24px;
  border: 1px solid rgba(183, 151, 111, 0.16);
  border-radius: 16px;
  background: rgba(255, 253, 248, 0.94);
  box-shadow: 0 10px 28px rgba(89, 75, 56, 0.07);
}

.base-dashboard-card--search {
  padding: 20px;
  border-color: rgba(212, 112, 82, 0.19);
}

@media (max-width: 640px) {
  .base-dashboard-card {
    padding: 18px;
  }

  .base-dashboard-card--search {
    padding: 20px;
  }
}
</style>
