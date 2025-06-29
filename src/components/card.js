const cardTemplate = document.querySelector('#card-template').content;

export function createCard(cardData, currentUserId, { handleDelete, handleLike, handleImageClick }) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Кнопка удаления видна только владельцу
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.style.display = 'block';
  }

  // Обновление лайков и состояния кнопки
  function updateLikes(likesArrayLength, isLiked) {
    likeCount.textContent = likesArrayLength;
    if (isLiked) {
      likeButton.classList.add('card__like-button_is-active');
    } else {
      likeButton.classList.remove('card__like-button_is-active');
    }
  }

  // Изначальное состояние лайка
  const isLiked = cardData.likes.some(user => user._id === currentUserId);
  updateLikes(cardData.likes.length, isLiked);

  deleteButton.addEventListener('click', () => handleDelete());
  likeButton.addEventListener('click', () => handleLike());
  cardImage.addEventListener('click', () => handleImageClick());

  // Экспортируем метод обновления лайков для внешнего использования
  cardElement.updateLikes = updateLikes;

  return cardElement;
}

// Функция удаления карточки
export function handleDelete(cardId, cardElement, apiDeleteCard) {
  if (confirm('Вы действительно хотите удалить эту карточку?')) {
    apiDeleteCard(cardId)
      .then(() => {
        cardElement.remove();
      })
      .catch(err => console.error('Ошибка удаления карточки:', err));
  }
}

// Функция обработки лайка
export function handleLike(cardData, currentUserId, cardElement, { addLike, removeLike }) {
  const isLiked = cardData.likes.some(user => user._id === currentUserId);
  const likePromise = isLiked ? removeLike(cardData._id) : addLike(cardData._id);

  likePromise
    .then(updatedCard => {
      cardData.likes = updatedCard.likes;
      cardElement.updateLikes(updatedCard.likes.length, updatedCard.likes.some(u => u._id === currentUserId));
    })
    .catch(err => console.error('Ошибка при обновлении лайка:', err));
}