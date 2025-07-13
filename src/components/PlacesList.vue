<template>
  <div
    class="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-[9999]"
  >
    <div class="bg-white rounded-2xl shadow-xl w-80 max-h-[80vh] overflow-y-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Список мест</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>
      <ul class="space-y-3">
        <li
          v-for="place in places"
          :key="place.id"
          class="flex justify-between items-center border-b pb-2"
        >
          <div>
            <div class="font-medium">{{ place.name }}</div>
            <div class="text-sm text-gray-500">⭐ {{ place.average.toFixed(1) }}/5</div>
          </div>
          <button
            @click="view(place)"
            class="text-blue-600 hover:underline text-sm"
          >
            Посмотреть
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  places: { type: Array, required: true }
});
const emit = defineEmits(['view-place', 'close']);

function view(place) {
  emit('view-place', place);
  emit('close');
}
</script>