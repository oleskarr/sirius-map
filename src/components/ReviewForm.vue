<template>
  <form @submit.prevent="submit" class="mb-3">
    <label class="block mb-1">Оценка (1–5):</label>
    <input v-model.number="rating" type="number" min="1" max="5" required class="border rounded-lg px-2 py-1 mb-2 w-full" />
    <label class="block mb-1">Комментарий:</label>
    <textarea v-model="comment" required class="border rounded-lg px-2 py-1 mb-2 w-full"></textarea>
    <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded-lg">Оставить отзыв</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { addReview } from '../utils/storage';

const props = defineProps({ placeId: { type: [String, Number], required: true } });
const emit = defineEmits(['new-review']);

const rating = ref(5);
const comment = ref('');

const submit = () => {
  addReview(props.placeId, rating.value, comment.value);
  rating.value = 5;
  comment.value = '';
  emit('new-review');
};
</script>


