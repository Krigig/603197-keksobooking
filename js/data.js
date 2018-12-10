'use strict';
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
