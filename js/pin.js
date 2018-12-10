'use strict';
//  pin.js
(function () {

  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var getPinElement = function (ad, clickHandler) {
    var pinElement = mapPinTemplate.cloneNode(true);

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';
    pinElement.querySelector('img').src = ad.author.avatar;
    pinElement.querySelector('img').alt = ad.offer.title;

    pinElement.addEventListener('click', function () {
      clickHandler(ad);
    });

    return pinElement;
  };

  window.pin = getPinElement;

})();
