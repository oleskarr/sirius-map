<template>
  <div class="p-4">
    <!-- Шапка проекта -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-center mb-2">Сириус.Путеводитель</h1>
      <p class="text-center text-gray-600 max-w-2xl mx-auto">
        Интерактивная карта интересных мест на территории Сириуса: парки, музеи, кафе и другие точки с отзывами и оценками.
      </p>
    </div>

    <!-- Навигация по основным разделам -->
    <div class="flex justify-center gap-4 mb-6">
      <button
        @click="showList = true"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Список мест
      </button>
      <button
        v-if="!showForm"
        @click="showForm = true"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        ➕ Добавить место
      </button>
    </div>

    <!-- Список мест как отдельный элемент -->
    <PlacesList
      v-if="showList"
      :places="sortedPlaces"
      @view-place="openPlaceCard"
      @close="showList = false"
    />

    <!-- Основной контент: форма/карточка и карта -->
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Левая панель: форма добавления и карточка -->
      <div class="w-full md:w-1/3">
        <div v-if="showForm" class="bg-white p-6 rounded-2xl shadow mb-4">
          <AddPlaceForm
            :lat="selectedLat"
            :lng="selectedLng"
            @place-added="handlePlaceAdded"
          />
          <button
            @click="showForm = false"
            class="mt-4 bg-gray-300 text-black px-3 py-1 rounded-lg"
          >
            Скрыть форму
          </button>
        </div>

        <div class="mt-4">
           <PlaceCard
  v-if="selectedPlace"
      :place="selectedPlace"
      @delete-place="deleteCurrentPlace"
    />
        </div>
      </div>

      <!-- Правая панель: карта -->
      <div class="w-full md:w-2/3">
        <MapView
          :selectedCategory="selectedCategory"
          @map-click="updateCoords"
          @select-place="openPlaceCard"
          ref="mapRef"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MapView from './components/MapView.vue';
import AddPlaceForm from './components/AddPlaceForm.vue';
import PlaceCard from './components/PlaceCard.vue';
import PlacesList from './components/PlacesList.vue';
import { loadPlaces, getReviewsByPlaceId } from './utils/storage';
import { deletePlace, deleteReviewsByPlaceId } from './utils/storage';

const selectedLat = ref(null);
const selectedLng = ref(null);
const selectedCategory = ref('');
const selectedPlace = ref(null);
const showForm = ref(false);
const showList = ref(false);
const mapRef = ref(null);

function updateCoords(coords) {
  selectedLat.value = coords.lat;
  selectedLng.value = coords.lng;
}

function reloadMap() {
  mapRef.value?.renderMarkers();
}

function openPlaceCard(place) {
  selectedPlace.value = place;
  showList.value = false;
}

function handlePlaceAdded() {
  reloadMap();
}

const sortedPlaces = computed(() => {
  return loadPlaces()
    .map(place => {
      const reviews = getReviewsByPlaceId(place.id);
      const avg = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;
      return { ...place, average: avg };
    })
    .sort((a, b) => b.average - a.average);
});
// Удаляем место и все его отзывы
function deleteCurrentPlace(placeId) {
  // 1. Удаляем точку
  deletePlace(placeId);
  // 2. Удаляем отзывы к ней
  deleteReviewsByPlaceId(placeId);

  // 3. Если это была открытая карточка — сбрасываем её
  if (selectedPlace.value?.id === placeId) {
    selectedPlace.value = null;
  }
  // 4. Перерисовываем маркеры на карте
  mapRef.value?.renderMarkers();
}

</script>
