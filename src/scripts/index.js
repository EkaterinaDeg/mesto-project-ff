
// @todo: Вывести карточки на страницу
const initialCards = window.initialCards;
// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content; 

// @todo: Функция создания карточки
function createCard(cardData, deleteCardCallback) {
    const cardElement = cardTemplate.cloneNode(true); // клонируем шаблон карточки
    const cardImage = cardElement.querySelector('.card__image'); // собираем элемент из картинки, названия и кнопки "удалить"
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
  
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
  
    deleteButton.addEventListener('click', () => {
        deleteCardCallback(deleteButton.closest('.card'));
    });
  
    return cardElement;
  }

  // @todo: Функция удаления карточки
  function deleteCard(cardElement) {
    cardElement.remove();
  }

  initialCards.forEach(cardData => {
    const card = createCard(cardData, deleteCard);
    placesList.append(card);
  });