<template>
  <select v-model="selected" @change="$emit('filter-change', selected)" class="border px-2 py-1 rounded-lg mb-4 w-full">
    <option value="">Все категории</option>
    <option value="музей">Музей</option>
    <option value="парк">Парк</option>
    <option value="кафе">Кафе</option>
  </select>
</template>

<script setup>
import { ref } from 'vue';
const selected = ref('');
</script>
