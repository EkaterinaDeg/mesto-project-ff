import './pages/index.css'; // Импорт основного CSS
import { initialCards } from './components/cards.js'; // Импорт начальных данных для карточек

import { openModal, closeModal, setModalEventListeners } from './components/modal.js';
import { createCard, deleteCard, handleLikeClick } from './components/card.js';

// Импорт изображений (для Webpack)
const avatarImage = new URL('./images/avatar.jpg', import.meta.url);
const logoImage = new URL('./images/logo.svg', import.meta.url);

// === DOM-элементы ===
const placesList = document.querySelector('.places__list');
const profileImage = document.querySelector('.profile__image');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const addPlaceButton = document.querySelector('.profile__add-button');

const profileEditPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const profileEditForm = profileEditPopup.querySelector('form');
const addCardForm = addCardPopup.querySelector('form');

const nameInput = profileEditForm.querySelector('input[name="name"]');
const jobInput = profileEditForm.querySelector('input[name="description"]');
const cardNameInput = addCardForm.querySelector('input[name="place-name"]');
const cardLinkInput = addCardForm.querySelector('input[name="link"]');

const popupImage = imagePopup.querySelector('.popup__image');
const popupimageCaption = imagePopup.querySelector('.popup__caption');

// === Инициализация ===
if (profileImage) {
  profileImage.style.backgroundImage = `url(${avatarImage})`;
} else {
  console.error('Ошибка: Элемент с классом .profile__image не найден в HTML. Не удалось установить фон.');
}

function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupimageCaption.textContent = cardData.name;
  openModal(imagePopup); // ИСПОЛЬЗУЕМ ИМПОРТИРОВАННУЮ openModal
}

function renderCard(cardData, position = 'append') {
  const card = createCard(cardData, deleteCard, handleLikeClick, openImagePopup);
  if (position === 'append') {
    placesList.append(card);
  } else {
    placesList.prepend(card);
  }
}

// === Рендер начальных карточек ===
initialCards.forEach(cardData => {
  renderCard(cardData, 'append');
});

// === Слушатели событий ===
setModalEventListeners(profileEditPopup);
setModalEventListeners(addCardPopup);
setModalEventListeners(imagePopup);

// Открытие попапа редактирования профиля
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(profileEditPopup);
});

// Отправка формы редактирования профиля
profileEditForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModal(profileEditPopup);
});

// Открытие попапа добавления новой карточки
addPlaceButton.addEventListener('click', () => {
  addCardForm.reset();
  openModal(addCardPopup);
});

// Отправка формы добавления новой карточки
addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  renderCard(newCardData, 'prepend');
  closeModal(addCardPopup);
  addCardForm.reset();
});