'use strict';

// utils.js
(function () {
  var random = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var randomArray = function (array) {
    return Math.floor(Math.random() * array.length);
  };

  var getRamdomArray = function (arr) {
    var shuffledArray = getShuffledArray(arr);
    var ramdomEnd = random(0, shuffledArray.length - 1);
    return shuffledArray.slice(0, ramdomEnd);
  };

  var getShuffledArray = function (arr) {
    var copyArr = arr.concat();
    copyArr.sort(function () {
      return Math.random() - 0.5;
    });
    return copyArr;
  };

  window.utils = {
    random: random,
    randomArray: randomArray,
    getRamdomArray: getRamdomArray,
    getShuffledArray: getShuffledArray
  };

})();

// data.js
(function () {
  var COORD_Y_MAX = 630;
  var COORD_Y_MIN = 130;

  var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var checkins = ['12:00', '13:00', '14:00'];
  var checkouts = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var getAds = function (many) {
    var result = [];
    for (var i = 0; i < many; i++) {
      var x = window.utils.random(0, document.body.clientWidth);
      var y = window.utils.random(COORD_Y_MIN, COORD_Y_MAX);

      var ad = {
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },
        'offer': {
          'title': titles[i],
          'address': x + ', ' + y,
          'price': window.utils.random(1000, 1000000),
          'type': types[window.utils.randomArray(types)],
          'rooms': window.utils.random(1, 5),
          'guests': window.utils.random(0, 10),
          'checkin': checkins[window.utils.randomArray(checkins)],
          'checkout': checkouts[window.utils.randomArray(checkouts)],
          'features': window.utils.getRamdomArray(features),
          'description': '',
          'photos': window.utils.getShuffledArray(photos)
        },
        'location': {
          'x': x,
          'y': y
        }
      };
      result.push(ad);
    }
    return result;
  };

  window.data = getAds;
})();
//

// pin.js
(function () {

  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var getPinElement = function (ad) {
    var pinElement = mapPinTemplate.cloneNode(true);

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';
    pinElement.querySelector('img').src = ad.author.avatar;
    pinElement.querySelector('img').alt = ad.offer.title;

    pinElement.addEventListener('click', function () {
      window.map.pinClickHandler(ad);
    });

    return pinElement;
  };

  window.pin = getPinElement;

})();


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

// map.js
(function () {
  var ADS_COUNT = 8;
  var BUTTON_MIDLE_WIDTH = 65 / 2;
  var BUTTON_HEIGHT = 62;
  var BUTTON_HEIGHT_END = BUTTON_HEIGHT + 22;

  var COORD_Y_MAX = 630;
  var COORD_Y_MIN = 130;

  var mapElement = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var renderAds = function (adsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < adsArray.length; i++) {
      var pinElement = window.pin(adsArray[i]);
      fragment.appendChild(pinElement);
    }
    mapPins.appendChild(fragment);
    return mapPins;
  };

  var adFormElements = document.querySelectorAll('.ad-form fieldset');
  var inputsAdForm = document.querySelectorAll('.ad-form input');
  var inputAddress = document.querySelector('#address');
  var mainPinElement = document.querySelector('.map__pin--main');

  inputAddress.value = (document.body.clientWidth / 2) + ', ' + 400;

  var setCoords = function (x, y) {
    inputAddress.value = x + ', ' + y;
  };

  var toggleFields = function (isDisabled) {
    mapElement.classList[isDisabled ? 'add' : 'remove']('map--faded');
    document.querySelector('.ad-form').classList[isDisabled ? 'add' : 'remove']('ad-form--disabled');

    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].disabled = isDisabled;
    }
    for (i = 0; i < inputsAdForm.length; i++) {
      inputsAdForm[i].disabled = isDisabled;
    }
    return isDisabled;
  };

  var isDisabled = toggleFields(true);

  var activateMap = function () {
    isDisabled = toggleFields(false);

    var ads = window.data(ADS_COUNT);
    renderAds(ads);
  };

  var pinClickHandler = function (ad) {
    window.cards.removeCard();
    window.cards.renderCard(ad);
  };

// Перетаскивание главного пина

  mainPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mainPinElementCoords = {
      'x': mainPinElement.offsetLeft + BUTTON_MIDLE_WIDTH,
      'y': mainPinElement.offsetTop + BUTTON_HEIGHT_END
    };
    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPinElementCoords.x = mainPinElementCoords.x - shift.x;
      mainPinElementCoords.y = mainPinElementCoords.y - shift.y;

      var mainPinElementCoordsCSS = {
        'x': mainPinElement.offsetLeft - shift.x,
        'y': mainPinElement.offsetTop - shift.y
      };

      if (mainPinElementCoordsCSS.y < COORD_Y_MAX && mainPinElementCoordsCSS.y > COORD_Y_MIN && (mainPinElementCoords.x + BUTTON_MIDLE_WIDTH) < mainPinElement.offsetParent.offsetWidth && (mainPinElementCoords.x - BUTTON_MIDLE_WIDTH) > 0) {
        mainPinElement.style.left = mainPinElementCoordsCSS.x + 'px';
        mainPinElement.style.top = mainPinElementCoordsCSS.y + 'px';
        setCoords(mainPinElementCoords.x, mainPinElementCoords.y);
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (isDisabled && dragged) {
        activateMap();
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    pinClickHandler: pinClickHandler,
    mapElement: mapElement
  };
})();

// form.js
(function () {
  var formElement = document.querySelector('.ad-form');
  var minPriceTypes = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var typeNewAdElement = formElement.querySelector('#type');
  var priceNewAdElement = formElement.querySelector('#price');

  var priceInvalid = function (number) {
    if (number === '') {
      number = 0;
    }
    priceNewAdElement.style.border = +number < priceNewAdElement.min || +number > priceNewAdElement.max ? '2px solid red' : '';
  };

  var priceHandler = function (evt) {
    priceInvalid(evt.target.value);
  };

  var typeHandler = function (evt) {
    var type = evt.target.value;
    priceNewAdElement.min = minPriceTypes[type];
    priceNewAdElement.placeholder = minPriceTypes[type];

    priceInvalid(priceNewAdElement.value);
  };

  typeNewAdElement.addEventListener('change', typeHandler);
  priceNewAdElement.addEventListener('change', priceHandler);

  var timeinNewAdElements = formElement.querySelector('#timein').options;
  var timeoutNewAdElements = formElement.querySelector('#timeout').options;

  formElement.querySelector('#timein').addEventListener('change', function () {
    timeoutNewAdElements.selectedIndex = timeinNewAdElements.selectedIndex;
  });

  formElement.querySelector('#timeout').addEventListener('change', function () {
    timeinNewAdElements.selectedIndex = timeoutNewAdElements.selectedIndex;
  });

  var invalidCapacity = function () {
    var roomNumberNewAdElement = formElement.querySelector('#room_number');
    var roomNumberValue = roomNumberNewAdElement.value;
    var capacityNewAdElement = formElement.querySelector('#capacity');

    if (roomNumberValue === '100') {
      capacityNewAdElement.options[3].disabled = false;
      for (var i = 0; i < capacityNewAdElement.options.length - 1; i++) {
        capacityNewAdElement.options[i].disabled = true;
      }
    } else {
      for (i = 0; i < capacityNewAdElement.options.length; i++) {
        if (capacityNewAdElement.options[i].value <= roomNumberValue) {
          capacityNewAdElement.options[i].disabled = false;
        } else {
          capacityNewAdElement.options[i].disabled = true;
        }
      }
      capacityNewAdElement.options[3].disabled = true;
    }

    var capacityIndex = capacityNewAdElement.options.selectedIndex;
    var capacityOptionElement = capacityNewAdElement.options[capacityIndex];
    capacityNewAdElement.style.border = capacityOptionElement.disabled ? '2px solid red' : '';
  };

  invalidCapacity();
  formElement.querySelector('#room_number').addEventListener('change', invalidCapacity);
  formElement.querySelector('#capacity').addEventListener('change', invalidCapacity);

})();
