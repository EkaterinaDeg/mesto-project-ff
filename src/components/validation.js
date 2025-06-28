// Проверка имени
function checkNameValidity(input) {
  if (input.value.trim() === '') {
    input.setCustomValidity("Вы пропустили это поле");
  } else {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
    if (!nameRegex.test(input.value)) {
      input.setCustomValidity("Разрешены только буквы, пробелы и дефисы");
    } else {
      input.setCustomValidity("");
    }
  }
}

// Проверка URL
function checkUrlValidity(input) {
  try {
    new URL(input.value);
    input.setCustomValidity("");
  } catch {
    input.setCustomValidity("Введите корректный URL");
  }
}

// Проверка валидности одного инпута
function validateInput(formElement, input) {
  if (input.name === 'name' || input.name === 'title') {
    checkNameValidity(input);
  } else if (input.name === 'link' || input.name === 'avatar') {
    checkUrlValidity(input);
  }

  const errorElement = formElement.querySelector(`#${input.id}-error`);

  if (!input.validity.valid) {
    input.classList.add('popup__input_type_error');
    errorElement.textContent = input.validationMessage;
    errorElement.classList.add('popup__input-error_active');
  } else {
    input.classList.remove('popup__input_type_error');
    errorElement.textContent = '';
    errorElement.classList.remove('popup__input-error_active');
  }
}

// Проверка есть ли невалидные инпуты
function hasInvalidInput(inputList) {
  return inputList.some(input => !input.validity.valid);
}

// Управление состоянием кнопки
function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add('popup__button_disabled');
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove('popup__button_disabled');
    buttonElement.disabled = false;
  }
}

// Установка слушателей на форму
function setEventListeners(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  toggleButtonState(inputList, buttonElement);

  inputList.forEach(input => {
    input.addEventListener('input', () => {
      validateInput(formElement, input);
      toggleButtonState(inputList, buttonElement);
    });
  });
}

// Включение валидации на все формы
export function enableValidation() {
  const formList = Array.from(document.querySelectorAll('.popup__form'));
  formList.forEach(formElement => {
    formElement.addEventListener('submit', evt => evt.preventDefault());
    setEventListeners(formElement);
  });
}

// Очистка ошибок и деактивация кнопки (при открытии попапа)
export function clearValidation(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  inputList.forEach(input => {
    input.classList.remove('popup__input_type_error');
    const errorElement = formElement.querySelector(`#${input.id}-error`);
    errorElement.textContent = '';
    errorElement.classList.remove('popup__input-error_active');
    input.setCustomValidity('');
  });

  buttonElement.classList.add('popup__button_disabled');
  buttonElement.disabled = true;
}