import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { fetchImages } from "./js/pixabay-api.js";
import { renderGallery, clearGallery } from "./js/render-functions.js";
import './style.css';

const searchForm = document.querySelector('#search-form');
const loader = document.querySelector('#loader');
const loadMoreBtn = document.querySelector('#load-more');
const loadMoreLoader = document.querySelector('#load-more-loader');
const endMessage = document.querySelector('#end-message');

let query = '';
let page = 1;

hideElement(loader);
hideElement(loadMoreBtn);
hideElement(loadMoreLoader);
hideElement(endMessage);

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  
  const form = event.currentTarget;
  query = form.elements.query.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  // Reset state
  page = 1;
  clearGallery();
  hideElement(loadMoreBtn);
  hideElement(endMessage);
  showElement(loader);

  try {
    const data = await fetchImages(query, page);
    
    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
    } else {
      renderGallery(data.hits);
      
      if (data.totalHits > 40) {
        showElement(loadMoreBtn);
      } else {
        showElement(endMessage);
      }
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideElement(loader);
    form.reset();
  }
}

async function onLoadMore() {
  page += 1;
  
  hideElement(loadMoreBtn);
  showElement(loadMoreLoader);

  try {
    const data = await fetchImages(query, page);
    renderGallery(data.hits);
    
    // Smooth scroll
    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
      const cardHeight = galleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    const totalPages = Math.ceil(data.totalHits / 40);
    if (page >= totalPages) {
      hideElement(loadMoreBtn);
      showElement(endMessage);
    } else {
      showElement(loadMoreBtn);
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  } finally {
    hideElement(loadMoreLoader);
  }
}

function showElement(element) {
  element.classList.remove('is-hidden');
}

function hideElement(element) {
  element.classList.add('is-hidden');
}
