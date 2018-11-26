 var random = function (number) {
  return Math.floor(Math.random() * number);
}

var photos = [];

var madeNumber = function (many) {

  for (var i = 0; i < many; i++) {

    number = '0' + String(random(many));

    for (var j = 0; j < photos.length; j++ ) {
      if (photos[j] === number) {
        // madeNumber(8);
        console.log('Это число нам не подходит');
      }
    }

    photos[i] = number;
  }

  return photos;
};

madeNumber(8);

var title = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var titleMix = [];

  for (i = 0; i < title.length; i++) {

    number = random(title);


    for (var j = 0; j < titleMix.length; j++ ) {
      if ( titleMix[j] === title[number]) {
        console.log('Это название нам не подходит');
      }
    }

    titleMix[i] = title[number];
  }


console.log(titleMix);

var flors = [
  {
    "author": {
      "avatar": ''
    },

    "offer": {
      "title": '',
      "address": '',
      "price": '',
      "type": '',
      "rooms": '',
      "guests": '',
      "checkin": '',
      "checkout": '',
      "features": '',
      "description": '',
      "photos": ''
    },

    "location": {
      'x': '',
      'y': ''
    }
  }
];

// flors[0].author.avatar = "img/avatars/user{{photos[0]}}.png";
// console.log(flors[0].author.avatar);


var madeFlor = function (many) {
  for (var i = 0; i < many; i++) {
    flors[i].author.avatar = "img/avatars/user" + photos[i] + ".png";
  }

  return flors;
};

madeFlor(8);

var mapPin = document.querySelector('.map__pin');

var renderFlors = function (flors) {
  var florElement = mapCard.cloneNode(true);

  florElement.getAttribute('src').textContent = flors.avatar;
  florElement.querySelector('.wizard-coat').style.fill = "left: {{location.x}}px; top: {{location.y}}px;";

  return florElement;
};

document.querySelector('.map').classList.remove('map--faded');
