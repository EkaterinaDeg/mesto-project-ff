const cardTemplate = document.querySelector('#card-template').content;

export function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function createCard(cardData, deleteCardCallback, likeClickHandler, openImagePopupCallback) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  // Заполняем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Привязываем обработчики событий
  deleteButton.addEventListener('click', () => deleteCardCallback(cardElement)); // Используем переданный колбэк
  likeButton.addEventListener('click', likeClickHandler); // Используем переданный колбэк

  // Обработчик открытия попапа с изображением по клику на картинку карточки
  cardImage.addEventListener('click', () => {
    // Вызываем переданную функцию openImagePopupCallback, передавая ей данные карточки
    openImagePopupCallback(cardData);
  });

  return cardElement;
}