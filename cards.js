'use strict';
// cards.js
(function () {
  var ESC_KEY = 27;
  var translationTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var getCardElement = function (ad) {
    var cardElement = mapCardTemplate.cloneNode(true);
    var offer = ad.offer;
    cardElement.querySelector('.popup__title').textContent = offer.title;
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
    cardElement.querySelector('.popup__text--address').textContent = offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = translationTypes[offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    cardElement.querySelector('.popup__description').textContent = offer.description;

    var featuresBlockElement = cardElement.querySelector('.popup__features');
    featuresBlockElement.innerHTML = '';
    var featuresFragment = document.createDocumentFragment();
    var className = 'popup__feature';

    for (var i = 0; i < offer.features.length; i++) {
      var liElement = document.createElement('li');
      liElement.className = className + ' ' + className + '--' + offer.features[i];
      featuresFragment.appendChild(liElement);
    }

    featuresBlockElement.appendChild(featuresFragment);

    for (var k = 0; k < offer.photos.length; k++) {
      var photosArray = cardElement.querySelectorAll('.popup__photos img');
      var photoElement = cardElement.querySelector('.popup__photos img').cloneNode(true);
      photoElement.src = offer.photos[k];
      cardElement.querySelector('.popup__photos').appendChild(photoElement);
    }
    cardElement.querySelector('.popup__photos').removeChild(photosArray[0]);

    var popupCloseElement = cardElement.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', function () {
      removeCard();
    });

    return cardElement;
  };

  var escButtonPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEY) {
      removeCard();
    }
  };

  var renderCard = function (ad) {
    var mapPlaceBefore = document.querySelector('.map__filters-container');
    window.map.mapElement.insertBefore(getCardElement(ad), mapPlaceBefore);
    document.addEventListener('keydown', escButtonPressHandler);
  };

  var removeCard = function () {
    var mapCardsElement = window.map.mapElement.querySelector('.map__card');
    if (!(mapCardsElement === null)) {
      window.map.mapElement.removeChild(mapCardsElement);
      document.removeEventListener('keyup', escButtonPressHandler);
    }
  };

  window.cards = {
    renderCard: renderCard,
    removeCard: removeCard
  };
})();