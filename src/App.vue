<template>
  <div class="relative min-h-screen">
  <img src="/public/карта.jpg" alt="" class="absolute inset-0 w-full h-full object-cover opacity-20 z-0" />
  <div class="absolute inset-0 bg-gradient-to-br from-primary/80 via-accent/70 to-danger/90 z-10"></div>
  <div class="relative z-20 p-6">
 
  <div class="p-4">
    <!-- Шапка проекта -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-center mb-2">Сириус.Путеводитель</h1>
      <p class="text-center text-gray-600 max-w-2xl mx-auto">
        Интерактивная карта интересных мест на территории Сириуса: парки, музеи, кафе и другие точки с отзывами и оценками.
      </p>
    </div>

    <!-- Навигация по основным разделам -->
    <div class="flex flex-col items-start space-y-4 mb-6">
  <button
    @click="showList = true"
    class="text-lg font-semibold text-white bg-dark hover:bg-danger px-8 py-4 rounded-2xl shadow-md"
  >
    Список мест
  </button>
  <button
    v-if="!showForm"
    @click="showForm = true"
    class="text-lg font-semibold text-white bg-dark hover:bg-danger px-8 py-4 rounded-2xl shadow-md"
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
    <div class="flex flex-col md:flex-row gap-2">
      <!-- Левая панель: форма добавления и карточка -->
      <div class="w-full md:w-1/2">
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
  @close="selectedPlace = null"
/>
        </div>
      </div>

      <!-- Правая панель: карта -->
      <div class="w-full md:w-2/3">
         <div class="mb-4">
        <Dropdown @filter-change="selectedCategory = $event" />
      </div>
        <MapView
          :selectedCategory="selectedCategory"
          @map-click="updateCoords"
          @select-place="openPlaceCard"
          ref="mapRef"
        />
        
      </div>
    </div>
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
import Dropdown from './components/Dropdown.vue'

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
