import './pages/index.css';
import { initialCards } from './components/cards.js';

const avatarImage = new URL('./images/avatar.jpg', import.meta.url);
const logoImage = new URL('./images/logo.svg', import.meta.url);

const placesList = document.querySelector('.places__list');
const profileImage = document.querySelector('.profile__image');
profileImage.style.backgroundImage = `url(${avatarImage})`;

const cardTemplate = document.querySelector('#card-template').content;

// Функции открытие/закрытие попапов
function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_active');
}

function setModalEventListeners(modal) {
  modal.addEventListener('mousedown', (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
  const closeButton = modal.querySelector('.popup__close');
  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(modal));
  }
}

// Карточки
function createCard(cardData, deleteCardCallback, likeClickHandler) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => deleteCardCallback(cardElement));
  likeButton.addEventListener('click', likeClickHandler);

    cardImage.addEventListener('click', () => {
    const popupImage = document.querySelector('.popup_type_image .popup__image');
    const popupCaption = document.querySelector('.popup_type_image .popup__caption');
    const imagePopup = document.querySelector('.popup_type_image');

    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;

    openModal(imagePopup);
  });

  return cardElement;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

// Рендер начальных карточек
initialCards.forEach(cardData => {
  const card = createCard(cardData, deleteCard);
  placesList.append(card);
});

// Попап с картинкой
const imagePopup = document.querySelector('.popup_type_image');
setModalEventListeners(imagePopup);

// Попап редактирования профиля
const profileEditButton = document.querySelector('.profile__edit-button');
const profileEditPopup = document.querySelector('.popup_type_edit');
const profileEditForm = profileEditPopup.querySelector('form');
const nameInput = profileEditForm.querySelector('input[name="name"]');
const jobInput = profileEditForm.querySelector('input[name="description"]');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

setModalEventListeners(profileEditPopup);

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(profileEditPopup);
});
profileEditForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModal(profileEditPopup);
});
const addPlaceButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');
const addCardForm = addCardPopup.querySelector('form');
const cardNameInput = addCardForm.querySelector('input[name="place-name"]');
const cardLinkInput = addCardForm.querySelector('input[name="link"]');

setModalEventListeners(addCardPopup);

addPlaceButton.addEventListener('click', () => {
  addCardForm.reset();
  openModal(addCardPopup);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  const newCard = createCard(newCardData, deleteCard, handleLikeClick);
  placesList.prepend(newCard);
  closeModal(addCardPopup);
  addCardForm.reset();
});