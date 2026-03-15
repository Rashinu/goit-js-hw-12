import axios from 'axios';

const API_KEY = '55024241-c21cdf479482b85ede3540c61';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
  const searchParams = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  };

  const response = await axios.get(BASE_URL, { params: searchParams });
  return response.data;
}
