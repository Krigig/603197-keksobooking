'use strict';

var random = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var randomArray = function (array) {
  return Math.floor(Math.random() * array.length);
};

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var checkins = ['12:00', '13:00', '14:00'];
var checkouts = ['12:00', '13:00', '14:00'];
var featuresOll = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosOll = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
// var flors = [
//   {
//     'author': {
//       'avatar': ''
//     },

//     'offer': {
//       'title': '',
//       'address': '',
//       'price': '',
//       'type': '',
//       'rooms': '',
//       'guests': '',
//       'checkin': '',
//       'checkout': '',
//       'features': '',
//       'description': '',
//       'photos': ''
//     },

//     'location': {
//       'x': '',
//       'y': ''
//     }
//   }
// ];
var flors = [];
var madeFlor = function (many) {
  for (var i = 0; i < many; i++) {
    var array = {};
    array.author = {};
    array.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

    array.location = {};
    // array.location.x = random(0, 100) + '%';
    array.location.x = random(0, 1200);
    array.location.y = random(130, 630);

    array.offer = {};
    array.offer.title = titles[i];
    array.offer.adress = String(array.location.x + ', ' + array.location.y);
    array.offer.price = random(1000, 1000000);
    array.offer.type = types[randomArray(types)];
    array.offer.rooms = random(1, 5);
    array.offer.guests = random(0, 10);
    array.offer.checkin = checkins[randomArray(checkins)];
    array.offer.checkout = checkouts[randomArray(checkouts)];

    array.offer.features = [];
    var longArray = random(1, featuresOll.length);
    for (var j = 0; j < longArray; j++) {
      array.offer.features.push(featuresOll[j]);
    }

    array.offer.description = '';
    array.offer.photos = photosOll;

    flors.push(array);
  }

  return flors;
};

madeFlor(8);
// console.log(flors);


var mapPin = document.querySelector('.map__pin');
var mapCard = document.querySelector('.map__card');

var renderFlors = function (florsPin) {
  var florElement = mapPin.cloneNode(true);

  florElement.style.left = florsPin.location.x + 'px';
  florElement.style.top = florsPin.location.y + 'px';
  florElement.querySelector('img').src = florsPin.author.avatar;
  florElement.querySelector('img').alt = florsPin.offer.title;

  return florElement;
};

var renderCards = function (florsCard) {
  var cardElement = mapCard.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = florsCard.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = florsCard.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = florsCard.offer.price + '₽/ночь';
  var text;
  if (florsCard.offer.type === 'flat') {
    text = 'Квартира';
  }
  if (florsCard.offer.type === 'bungalo') {
    text = 'Бунгало';
  }
  if (florsCard.offer.type === 'house') {
    text = 'Дом';
  }
  if (florsCard.offer.type === 'palace') {
    text = 'Дворец';
  }
  cardElement.querySelector('.popup__type').textContent = text;
  cardElement.querySelector('.popup__text--capacity').textContent = florsCard.offer.rooms + ' комнаты для ' + florsCard.offer.guests + ' гостей';

  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + florsCard.offer.checkin + ', выезд до ' + florsCard.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = florsCard.offer.features;
  cardElement.querySelector('.popup__description').textContent = florsCard.offer.description;
  // cardElement.querySelector('.popup__photos').src = text;

  return cardElement;
};

var fragment = document.createDocumentFragment();
var fragmentMap = document.createDocumentFragment();
for (var i = 0; i < flors.length; i++) {
  fragment.appendChild(renderFlors(flors[i]));
  fragmentMap.appendChild(renderCards(flors[i]));
}

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(fragment);

var mapCards = document.querySelector('.map');
mapCards.appendChild(fragmentMap);

document.querySelector('.map').classList.remove('map--faded');
