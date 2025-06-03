import './pages/index.css';
// @todo: Вывести карточки на страницу
const iconImage = new URL('./images/add-icon.svg', import.meta.url);
const avatarImage = new URL('./images/avatar.jpg', import.meta.url);
const card1Image = new URL('./images/card_1.jpg', import.meta.url);
const card2Image = new URL('./images/card_2.jpg', import.meta.url);
const card3Image = new URL('./images/card_3.jpg', import.meta.url);
const closeImage = new URL('./images/close.svg', import.meta.url);
const deleteImage = new URL('./images/delete-icon.svg', import.meta.url);
const editImage = new URL('./images/edit-icon.svg', import.meta.url);
const likeactiveImage = new URL('./images/like-active.svg', import.meta.url);
const likeinactiveImage = new URL('./images/like-inactive.svg', import.meta.url);
const logoImage = new URL('./images/logo.svg', import.meta.url);

const initialCards = [
  // меняем исходные пути на переменные
  { name: 'Иконка добавления', link: iconImage },
  { name: 'Аватарка', link: avatarImage },
  { name: 'Карточка 1', link: card1Image },
  { name: 'Карточка 2', link: card2Image },
  { name: 'Карточка 3', link: card3Image },
  { name: 'Иконка закрытия', link: closeImage },
  { name: 'Иконка удаления', link: deleteImage },
  { name: 'Иконка редактирования', link: editImage },
  { name: 'Лайк', link: likeactiveImage },
  { name: 'Лайк не активный', link: likeinactiveImage },
  { name: 'Лого', link: logoImage }
];


  // postcss.config.js
   const autoprefixer = require('autoprefixer');
   const cssnano = require('cssnano');

   module.exports = {
     plugins: [
       autoprefixer,
       cssnano({ preset: 'default' })
     ]
    };
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