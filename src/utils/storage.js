const STORAGE_KEY_PLACES = 'sirius_places';
const STORAGE_KEY_REVIEWS = 'sirius_reviews';

export function loadPlaces() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_PLACES) || '[]');
}

export function savePlace(place) {
  const current = loadPlaces();
  current.push(place);
  localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(current));
}

// Удалить одно место по ID
export function deletePlace(placeId) {
  const filtered = loadPlaces().filter(p => String(p.id) !== String(placeId));
  localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(filtered));
}

export function loadReviews() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS) || '[]');
}

export function addReview(placeId, rating, comment) {
  const reviews = loadReviews();
  reviews.push({
    placeId: String(placeId),
    rating: Number(rating),
    comment,
    date: new Date().toLocaleDateString()
  });
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
}

// Удалить все отзывы для заданного места
export function deleteReviewsByPlaceId(placeId) {
  const filtered = loadReviews().filter(r => String(r.placeId) !== String(placeId));
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(filtered));
}

export function getReviewsByPlaceId(placeId) {
  const id = String(placeId);
  return loadReviews().filter(r => String(r.placeId) === id);
}
