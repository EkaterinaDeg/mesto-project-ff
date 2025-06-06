/**
 * Открывает модальное окно.
@param {HTMLElement} modal - Элемент модального окна.
 */
export function openModal(modal) {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

/**
 * Закрывает модальное окно.
 * @param {HTMLElement} modal - Элемент модального окна.
 */
export function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

/**
 * Обработчик закрытия модального окна по нажатию Esc.
 * @param {KeyboardEvent} evt - Событие клавиатуры.
 */
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

/**
 * Устанавливает слушатели событий для закрытия модального окна (по клику на оверлей и по кнопке закрытия).
 * @param {HTMLElement} modal - Элемент модального окна.
 */
export function setModalEventListeners(modal) {
  modal.addEventListener('mousedown', (evt) => {
    if (evt.target === modal) { // Закрытие по клику на оверлей
      closeModal(modal);
    }
  });
  const closeButton = modal.querySelector('.popup__close');
  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(modal)); // Закрытие по кнопке
  }
}