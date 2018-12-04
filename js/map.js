'use strict';

var ADS_COUNT = 8;
var BUTTON_MIDLE_WIDTH = 65 / 2;
var BUTTON_HEIGHT = 65;
var BUTTON_HEIGHT_END = BUTTON_HEIGHT + 20;
var ESC_KEY = 27;

var mapElement = document.querySelector('.map');
var formElement = document.querySelector('.ad-form');

var getShuffledArray = function (arr) {
  var copyArr = arr.concat();
  copyArr.sort(function () {
    return Math.random() - 0.5;
  });
  return copyArr;
};

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

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var translationTypes = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var checkins = ['12:00', '13:00', '14:00'];
var checkouts = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


var getAds = function (many) {
  var result = [];
  for (var i = 0; i < many; i++) {
    var x = random(0, document.body.clientWidth);
    var y = random(130, 630);

    var ad = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': titles[i],
        'address': x + ', ' + y,
        'price': random(1000, 1000000),
        'type': types[randomArray(types)],
        'rooms': random(1, 5),
        'guests': random(0, 10),
        'checkin': checkins[randomArray(checkins)],
        'checkout': checkouts[randomArray(checkouts)],
        'features': getRamdomArray(features),
        'description': '',
        'photos': getShuffledArray(photos)
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


var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getPinElement = function (florsPin) {
  var PinElement = mapPinTemplate.cloneNode(true);

  PinElement.style.left = florsPin.location.x + 'px';
  PinElement.style.top = florsPin.location.y + 'px';
  PinElement.querySelector('img').src = florsPin.author.avatar;
  PinElement.querySelector('img').alt = florsPin.offer.title;

  PinElement.addEventListener('click', function () {
    removeCard();
    renderCard(florsPin);
    buttonClickHandler();
  });

  return PinElement;
};

var mapPins = document.querySelector('.map__pins');
var renderAds = function (adsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsArray.length; i++) {
    var pinElement = getPinElement(adsArray[i]);
    fragment.appendChild(pinElement);
  }
  mapPins.appendChild(fragment);
  return mapPins;
};

var getCardElement = function (ad) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var offer = ad.offer;
  cardElement.querySelector('.popup__title').textContent = offer.title;
  cardElement.querySelector('.popup__avatar').scr = offer.avatar;
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

  return cardElement;
};

var renderCard = function (ad) {
  var mapPlaceBefore = document.querySelector('.map__filters-container');
  mapElement.insertBefore(getCardElement(ad), mapPlaceBefore);
};


var removeCard = function () {
  var mapCardsElement = mapElement.querySelector('article.map__card.popup');
  if (!(mapCardsElement === null)) {
    mapElement.removeChild(mapCardsElement);
  }
};

var buttonClickHandler = function () {
  var buttonCloseAd = document.querySelector('.popup__close');

  buttonCloseAd.addEventListener('click', function () {
    removeCard();
  });

  buttonCloseAd.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEY) {
      removeCard();
    }
  });
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
  formElement.classList[isDisabled ? 'add' : 'remove']('ad-form--disabled');

  for (var i = 0; i < adFormElements.length; i++) {
    adFormElements[i].disabled = isDisabled;
  }
  for (i = 0; i < inputsAdForm.length; i++) {
    inputsAdForm[i].disabled = isDisabled;
  }
};
toggleFields(true);

var activateMap = function (evt) {
  toggleFields(false);

  var buttonX = evt.clientX + BUTTON_MIDLE_WIDTH;
  var buttonY = evt.clientY + BUTTON_HEIGHT_END;
  setCoords(buttonX, buttonY);

  var ads = getAds(ADS_COUNT);
  renderAds(ads);

  mainPinElement.removeEventListener('mouseup', activateMap);
};


mainPinElement.addEventListener('mouseup', activateMap);

// Валидация формы

var minPriceTypes = {
  'Дворец': 10000,
  'Квартира': 1000,
  'Дом': 5000,
  'Бунгало': 0
};

var typeNewAdElement = formElement.querySelector('#type');
var priceNewAdElement = formElement.querySelector('#price');

typeNewAdElement.addEventListener('change', function () {
  var type = typeNewAdElement.options[typeNewAdElement.options.selectedIndex];
  priceNewAdElement.minlength = minPriceTypes[type.text];
  priceNewAdElement.placeholder = minPriceTypes[type.text];
});

var timeinNewAdElements = formElement.querySelector('#timein').options;
var timeoutNewAdElements = formElement.querySelector('#timeout').options;

formElement.querySelector('#timein').addEventListener('change', function () {
  timeoutNewAdElements.selectedIndex = timeinNewAdElements.selectedIndex;
});

formElement.querySelector('#timeout').addEventListener('change', function () {
  timeinNewAdElements.selectedIndex = timeoutNewAdElements.selectedIndex;
});

formElement.querySelector('#room_number').addEventListener('change', function () {
  var roomNumberNewAdElement = formElement.querySelector('#room_number');
  var roomNumberIndex = roomNumberNewAdElement.options.selectedIndex;
  var roomNumberValue = roomNumberNewAdElement[roomNumberIndex].value;
  var capacityNewAdElement = formElement.querySelector('#capacity');


  if (roomNumberValue === '100') {
    capacityNewAdElement.options[3].disabled = false;
    for (var i = 0; i < capacityNewAdElement.options.length - 1; i++) {
      capacityNewAdElement.options[i].disabled = true;
    }
  } else {
    for (i = 0; i < capacityNewAdElement.options.length; i++) {
      if (capacityNewAdElement[i].value <= roomNumberValue) {
        capacityNewAdElement.options[i].disabled = false;
      } else {
        capacityNewAdElement.options[i].disabled = true;
      }
    }
    capacityNewAdElement.options[3].disabled = true;
  }
});

