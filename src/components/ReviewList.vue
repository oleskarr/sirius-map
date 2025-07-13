<template>
  <div>
    <h3 class="font-bold mb-1">Отзывы:</h3>
    <div v-if="!reviews.length" class="text-gray-400 italic">Пока нет отзывов</div>
    <ul>
      <li v-for="(r, i) in reviews" :key="i" class="border-t pt-2 mt-2">
        <div class="text-yellow-600 font-semibold">Оценка: {{ r.rating }}/5</div>
        <div class="text-sm">{{ r.comment }}</div>
        <div class="text-xs text-gray-500">{{ r.date }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['reviews']
};
</script>