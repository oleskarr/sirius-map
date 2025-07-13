<template>
  <form
  @submit.prevent="submitForm"
 class="max-w-2xl w-full mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow space-y-5"
>
    <h2 class="text-xl font-bold text-gray-800 text-center">Добавить место</h2>

    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900  dark:text-white">Название</label>
      <input
        v-model="name"
        type="text"
        required
        class="w-full  py-2 px-4 text-sm border rounded-lg border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Адрес</label>
      <input
        v-model="address"
        type="text"
        required
        class="w-full !rounded-lg py-2 px-4 text-sm border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      />
  
</div>

    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категория</label>
      <select
        v-model="category"
        required
        class="w-full rounded-lg py-2 px-4 text-sm border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      >
        <option disabled value="">Выберите категорию</option>
        <option value="музей">Музей</option>
        <option value="парк">Парк</option>
        <option value="кафе">Кафе</option>
      </select>
    </div>

    <div>
      <label class="block mb-1 text-sm font-medium text-gray-700 text-center">Загрузить фото</label>
      <input
        type="file"
        accept="image/*"
        @change="handleFileChange"
        class="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:border file:rounded-lg file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
      />
      <div v-if="preview" class="flex justify-center items-center mt-3">
        <img
          :src="preview"
          alt="Превью"
          class="rounded-lg border w-2/3 object-contain aspect-square"
        />
      </div>
    </div>

    <div class="text-sm text-gray-500 text-center">
      Координаты: 
      <span v-if="lat && lng">{{ lat.toFixed(5) }}, {{ lng.toFixed(5) }}</span>
      <span v-else>Кликните на карту</span>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Добавить
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { savePlace } from '../utils/storage';


const address = ref('');
const lat = ref('');
const lng = ref('');
const props = defineProps(['lat', 'lng']);
const emit = defineEmits(['place-added']);

const name = ref('');

const category = ref('');
const image = ref('');
const preview = ref('');

function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    image.value = evt.target.result;
    preview.value = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function submitForm() {
  savePlace({
    id: Date.now(),
    name: name.value,
    address: address.value,
    category: category.value,
    image: image.value,
    lat: lat.value,         // <--- обязательно!
    lng: lng.value    
  });

  name.value = '';
  address.value = '';
  category.value = '';
  image.value = '';
  preview.value = '';

  emit('place-added');
}
watch([() => props.lat, () => props.lng], async ([newLat, newLng]) => {
  if (newLat && newLng) {
    lat.value = newLat;
    lng.value = newLng;
    address.value = await reverseGeocode(newLat, newLng);
  }
});

async function reverseGeocode(lat, lng) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`);
  const data = await res.json();
  return data.display_name || '';
}
async function geocodeAddress(address) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&accept-language=ru&limit=1`);
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } else {
    return null;
  }
}

async function findCoordsByAddress() {
  if (!address.value) return;
  const coords = await geocodeAddress(address.value);
  if (coords) {
    lat.value = coords.lat;
    lng.value = coords.lng;
    // можно эмитить на карту, чтобы обновился маркер
    // emit('coords-updated', coords)
  } else {
    alert('Координаты не найдены!');
  }
}
</script>
