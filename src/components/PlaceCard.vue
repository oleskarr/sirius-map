<template>
  <div class="bg-white rounded-xl shadow p-4 mb-4 w-full">
    <!-- Заголовок и описание -->
    <h2 class="text-xl font-semibold mb-2">{{ place.name }}</h2>
    <p class="text-gray-500 text-sm mb-1">{{ place.address }}</p>
    <p class="text-sm italic text-blue-600 mb-2">Категория: {{ place.category }}</p>
    <!-- Фото места -->
    <img
      v-if="place.image"
      :src="place.image"
      alt="Фото места"
      class="rounded mb-3 w-full object-cover max-h-48"
    />
    <!-- Средняя оценка -->
    <p class="mb-2">Средняя оценка: {{ averageRating.toFixed(1) }}/5</p>

    <!-- Форма для добавления отзыва -->
    <ReviewForm
      :placeId="place.id"
      @new-review="loadReviewsForThis"
    />

    <!-- Список отзывов -->
    <ReviewList :reviews="reviews" />

    <!-- Кнопка удаления места -->
    <div class="flex justify-end mt-4">
      <button
        @click="onDelete"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Удалить место
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import ReviewForm from './ReviewForm.vue';
import ReviewList from './ReviewList.vue';
import { getReviewsByPlaceId } from '../utils/storage';

// Определяем свойства и события
const props = defineProps({ place: { type: Object, required: true } });
const emit = defineEmits(['new-review', 'delete-place']);

// Состояние отзывов
const reviews = ref([]);

// Загрузка отзывов для текущего места
function loadReviewsForThis() {
  reviews.value = getReviewsByPlaceId(props.place.id);
}

// Вычисление средней оценки
const averageRating = computed(() => {
  if (!reviews.value.length) return 0;
  return reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length;
});

// При монтировании и изменении place.id обновляем отзывы
onMounted(loadReviewsForThis);
watch(() => props.place.id, loadReviewsForThis);

// Удаление места
function onDelete() {
  if (confirm(`Удалить место "${props.place.name}"?`)) {
    emit('delete-place', props.place.id);
  }
}
</script>
