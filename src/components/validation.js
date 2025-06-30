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
function validateInput(formElement, input, inputErrorClass, errorClass) {
  if (input.name === 'name' || input.name === 'title') {
    checkNameValidity(input);
  } else if (input.name === 'link' || input.name === 'avatar') {
    checkUrlValidity(input);
  }

  const errorElement = formElement.querySelector(`#${input.id}-error`);

  if (!input.validity.valid) {
    input.classList.add(inputErrorClass);
    errorElement.textContent = input.validationMessage;
    errorElement.classList.add(errorClass);
  } else {
    input.classList.remove(inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(errorClass);
  }
}

// Проверка есть ли невалидные инпуты
function hasInvalidInput(inputList) {
  return inputList.some(input => !input.validity.valid);
}

// Вспомогательная функция для управления состоянием кнопки
function _setButtonState(button, isDisabled, inactiveButtonClass) {
  button.disabled = isDisabled;
  button.classList.toggle(inactiveButtonClass, isDisabled);
}

// Управление состоянием кнопки (проверка валидности инпутов + блокировка)
function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
  const isDisabled = hasInvalidInput(inputList);
  _setButtonState(buttonElement, isDisabled, inactiveButtonClass);
}

// Установка слушателей на форму
function setEventListeners(
  formElement,
  inputSelector,
  inputErrorClass,
  errorClass,
  submitButtonSelector,
  inactiveButtonClass
) {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);

  toggleButtonState(inputList, buttonElement, inactiveButtonClass);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      validateInput(formElement, inputElement, inputErrorClass, errorClass);
      toggleButtonState(inputList, buttonElement, inactiveButtonClass);
    });
  });
}

// Включение валидации на все формы
export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach(formElement => {
    formElement.addEventListener('submit', evt => evt.preventDefault());
    setEventListeners(
      formElement,
      validationConfig.inputSelector,
      validationConfig.inputErrorClass,
      validationConfig.errorClass,
      validationConfig.submitButtonSelector,
      validationConfig.inactiveButtonClass
    );
  });
}

// Очистка ошибок и деактивация кнопки (при открытии попапа)
export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach(input => {
    input.setCustomValidity('');
    validateInput(formElement, input, validationConfig.inputErrorClass, validationConfig.errorClass);
  });

  toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
}

// Экспортируем toggleButtonState, если нужно использовать в index.js
export { toggleButtonState };