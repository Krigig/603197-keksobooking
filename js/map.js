'use strict';
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

var ads = [];
var madeFlor = function (many) {
  for (var i = 0; i < many; i++) {  
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
        'features': [],
        'description': '',
        'photos': photosOll
      },
      'location': {
        'x': x,
        'y': y
      }
    };

    var x = random(0, 1200);
    var y = random(130, 630);
    var longArray = random(1, featuresOll.length);
    for (var j = 0; j < longArray; j++) {
      ad.offer.features.push(featuresOll[j]);
    }

    ads.push(ad);
  }

  return ads;
};

madeFlor(8);

var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var renderAds = function (florsPin) {
  var florElement = mapPinTemplate.cloneNode(true);

  florElement.style.left = florsPin.location.x + 'px';
  florElement.style.top = florsPin.location.y + 'px';
  florElement.querySelector('img').src = florsPin.author.avatar;
  florElement.querySelector('img').alt = florsPin.offer.title;

  return florElement;
};

var renderCards = function (florsCard) {
  var cardElement = mapCardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = florsCard.offer.title;
  cardElement.querySelector('.popup__avatar').scr = florsCard.offer.avatar;
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
  var features = cardElement.querySelectorAll('.popup__feature');
  for (var k = 0; k < florsCard.offer.features.length; k++) {
    features[k].textContent = florsCard.offer.features[k];
  }
  if (featuresOll.length > florsCard.offer.features.length) {
    for (var m = florsCard.offer.features.length - 1; m < featuresOll.length; m++) {
      cardElement.querySelector('.popup__features').removeChild(features[m]);
    }
  }

  cardElement.querySelector('.popup__description').textContent = florsCard.offer.description;
  for (k = 0; k < florsCard.offer.photos.length; k++) {
    var photosArray = cardElement.querySelectorAll('.popup__photos img');
    var photoElement = cardElement.querySelector('.popup__photos img').cloneNode(true);
    photoElement.src = florsCard.offer.photos[k];
    cardElement.querySelector('.popup__photos').appendChild(photoElement);
  }
  cardElement.querySelector('.popup__photos').removeChild(photosArray[0]);

  return cardElement;
};

var fragment = document.createDocumentFragment();
var fragmentMap = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderAds(ads[i]));
  fragmentMap.appendChild(renderCards(ads[i]));
}

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(fragment);

var mapCards = document.querySelector('.map');
mapCards.insertBefore(fragmentMap, document.querySelector('.map__filters-container'));

document.querySelector('.map').classList.remove('map--faded');
