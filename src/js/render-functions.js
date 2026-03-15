import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector('.gallery');
let lightbox = null;

export function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <div class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
              </div>
              <div class="info-item">
                <b>Views</b>
                <span>${views}</span>
              </div>
              <div class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
              </div>
              <div class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
              </div>
            </div>
          </a>
        </li>
      `;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }
}
