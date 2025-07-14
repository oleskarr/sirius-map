<template>
  <div id="map" class="h-[650px] w-full rounded-2xl border-4 border-dark shadow-2xl"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import L from 'leaflet';
import { loadPlaces } from '../utils/storage';

const props = defineProps(['selectedCategory']);
const emit = defineEmits(['map-click', 'select-place']);

const map = ref(null);
const markers = ref([]);
let resizeObserver = null;


const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [32, 40],
  iconAnchor: [16, 40]
});

const initMap = () => {
  map.value = L.map('map', {
    zoomControl: true,
    attributionControl: false,
    minZoom: 13,
    maxZoom: 19,
    maxBounds: [
      [43.38, 39.90],  // юго-западнее
      [43.48, 40.05]   // северо-восточнее
    ],
  }).setView([43.43, 39.975], 14);

  // Красивая карта от Carto
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & Carto',
    subdomains: 'abcd',
    maxZoom: 19,
  detectRetina: true,
  tileSize: 512,
  zoomOffset: -1,
  }).addTo(map.value);

 
  map.value.on('click', (e) => {
    const { lat, lng } = e.latlng;
    emit('map-click', { lat, lng });
  });

  renderMarkers();

  setTimeout(() => {
    map.value.invalidateSize();
  }, 300);
};

const renderMarkers = () => {
  markers.value.forEach(marker => map.value.removeLayer(marker));
  markers.value = [];

  const places = loadPlaces();
  const filtered = props.selectedCategory
    ? places.filter(p => p.category === props.selectedCategory)
    : places;

  filtered.forEach(place => {
    if (!place.lat || !place.lng || !place.name) return;

    const marker = L.marker([place.lat, place.lng], { icon })
      .addTo(map.value)
      .on('click', () => emit('select-place', place));

    marker.bindTooltip(place.name, {
      permanent: false,
      direction: 'top'
    });

    markers.value.push(marker);
  });
};

watch(() => props.selectedCategory, renderMarkers);

onMounted(() => {
  initMap();

  const mapContainer = document.getElementById('map');
  resizeObserver = new ResizeObserver(() => {
    map.value?.invalidateSize();
  });

  if (mapContainer) {
    resizeObserver.observe(mapContainer);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});


</script>
