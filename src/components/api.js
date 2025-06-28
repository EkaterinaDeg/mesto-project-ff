const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-41',
  headers: {
    authorization: '11cc7ba8-74ee-4b2e-9056-1509413026a3',
    'Content-Type': 'application/json'
  }
};

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: {
      authorization: config.headers.authorization
    }
  }).then(checkResponse);
};

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// Загрузка данных пользователя
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: {
      authorization: config.headers.authorization
    }
  }).then(checkResponse);
};

// Обновление профиля
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
};

// Добавление новой карточки
export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then(checkResponse);
};

// Удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: config.headers.authorization
    }
  }).then(checkResponse);
};

// Поставить лайк
export const addLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: {
      authorization: config.headers.authorization
    }
  }).then(checkResponse);
};

// Снять лайк
export const removeLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: config.headers.authorization
    }
  }).then(checkResponse);
};

// Обновление аватара
export const updateAvatar = (avatarLink) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarLink })
  }).then(checkResponse);
};