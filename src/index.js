import './pages/index.css';
import { initialCards } from './components/cards.js'; // Локальные карточки
import { handleDelete, handleLike } from './components/card.js';
import { openModal, closeModal, setModalEventListeners } from './components/modal.js';
import { createCard } from './components/card.js';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCard as apiDeleteCard,
  addLike,
  removeLike,
  updateAvatar
} from './components/api.js';


const avatarEditPopup = document.querySelector('.popup_type_avatar');
const avatarEditForm = avatarEditPopup.querySelector('form');
const avatarLinkInput = avatarEditForm.querySelector('input[name="avatar"]');
const profileAvatarContainer = document.querySelector('.profile__image');
const avatarEditButton = document.createElement('button');
avatarEditButton.classList.add('profile__avatar-edit-button');
avatarEditButton.type = 'button';
profileAvatarContainer.style.position = 'relative';
profileAvatarContainer.append(avatarEditButton);
avatarEditButton.title = 'Изменить аватар';

const avatarImage = new URL('./images/avatar.jpg', import.meta.url);

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

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
};

let currentUserId = null;

if (profileImage) {
  profileImage.style.backgroundImage = `url(${avatarImage})`;
} else {
  console.error('Ошибка: Элемент с классом .profile__image не найден в HTML. Не удалось установить фон.');
}

// Функция для управления состоянием кнопок при загрузке
function toggleButtonText(button, isLoading, loadingText = 'Сохранение...') {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.originalText || 'Сохранить';
  }
}

// Отдельная функция для управления состоянием кнопки (блокировка/разблокировка)
function toggleButtonState(button, isDisabled) {
  button.disabled = isDisabled;
}

function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupimageCaption.textContent = cardData.name;
  openModal(imagePopup);
}

function renderCard(cardData, position = 'append') {
  const card = createCard(cardData, currentUserId, {
    handleDelete: () => handleDelete(cardData._id, card, apiDeleteCard),
    handleLike: () => handleLike(cardData, currentUserId, card, { addLike, removeLike }),
    handleImageClick: () => openImagePopup(cardData)
  });

  if (position === 'append') {
    placesList.append(card);
  } else {
    placesList.prepend(card);
  }
}

// Рендер локальных карточек
initialCards.forEach(cardData => renderCard(cardData, 'append'));

// Загрузка данных пользователя и карточек с сервера
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    currentUserId = userData._id;

    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    cardsData.forEach(cardData => renderCard(cardData, 'append'));
  })
  .catch(err => console.error('Ошибка при загрузке данных с сервера:', err));

setModalEventListeners(profileEditPopup);
setModalEventListeners(addCardPopup);
setModalEventListeners(imagePopup);
setModalEventListeners(avatarEditPopup);

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(profileEditForm, validationConfig);
  openModal(profileEditPopup);
});

profileEditForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = profileEditForm.querySelector(validationConfig.submitButtonSelector);
  toggleButtonText(submitButton, true);
  toggleButtonState(submitButton, true);

  updateUserInfo(nameInput.value, jobInput.value)
    .then(updatedUser => {
      profileName.textContent = updatedUser.name;
      profileJob.textContent = updatedUser.about;
      profileImage.style.backgroundImage = `url(${updatedUser.avatar})`;
      closeModal(profileEditPopup);
    })
    .catch(err => console.error('Ошибка обновления профиля:', err))
    .finally(() => {
      toggleButtonText(submitButton, false);
      toggleButtonState(submitButton, false);
    });
});

addPlaceButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardPopup);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = addCardForm.querySelector(validationConfig.submitButtonSelector);
  toggleButtonText(submitButton, true);
  toggleButtonState(submitButton, true);

  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then(newCardData => {
      renderCard(newCardData, 'prepend');
      closeModal(addCardPopup);
      addCardForm.reset();
    })
    .catch(err => console.error('Ошибка добавления карточки:', err))
    .finally(() => {
      toggleButtonText(submitButton, false);
      toggleButtonState(submitButton, false);
    });
});

enableValidation(validationConfig);

profileEditForm.addEventListener('reset', () => clearValidation(profileEditForm, validationConfig));
addCardForm.addEventListener('reset', () => clearValidation(addCardForm, validationConfig));

avatarEditButton.addEventListener('click', () => {
  avatarEditForm.reset();
  clearValidation(avatarEditForm, validationConfig);
  openModal(avatarEditPopup);
});

avatarEditForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = avatarEditForm.querySelector(validationConfig.submitButtonSelector);
  toggleButtonText(submitButton, true);
  toggleButtonState(submitButton, true);

  updateAvatar(avatarLinkInput.value)
    .then(updatedUser => {
      profileImage.style.backgroundImage = `url(${updatedUser.avatar})`;
      closeModal(avatarEditPopup);
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => {
      toggleButtonText(submitButton, false);
      toggleButtonState(submitButton, false);
    });
});