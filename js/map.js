'use strict';
// map.js
(function () {

  var BUTTON_MIDLE_WIDTH = 64 / 2;
  var BUTTON_HEIGHT = 84;
  var MAX_VALUE_PINS = 5;

  var COORD_Y_MAX = 630;
  var COORD_Y_MIN = 130;

  var defoltButtonCoords = {
    x: Math.round(document.body.clientWidth / 2),
    y: Math.round(mapElement.clientHeight / 2)
  };

  var mapElement = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');

  var renderAds = function (adsArray) {
    var fragment = document.createDocumentFragment();
    var length = adsArray.length > MAX_VALUE_PINS ? MAX_VALUE_PINS : adsArray.length;
    for (var i = 0; i < length; i++) {
      if (adsArray[i].offer) {
        var pinElement = window.pin(adsArray[i], pinClickHandler);
        fragment.appendChild(pinElement);
      }
    }
    mapPins.appendChild(fragment);
    return mapPins;
  };

  var adFormElements = document.querySelectorAll('.ad-form fieldset');
  var inputsAdForm = document.querySelectorAll('.ad-form input');
  var inputAddress = document.querySelector('#address');
  var mainPinElement = document.querySelector('.map__pin--main');

  inputAddress.value = defoltButtonCoords.x + ', ' + defoltButtonCoords.y;

  var setCoords = function (x, y) {
    inputAddress.value = x + ', ' + y;
  };

  var toggleFields = function (isDisabled) {
    mapElement.classList[isDisabled ? 'add' : 'remove']('map--faded');
    document.querySelector('.ad-form').classList[isDisabled ? 'add' : 'remove']('ad-form--disabled');

    adFormElements.forEach(function (adFormElement) {
      adFormElement.disabled = isDisabled;
    });

    inputsAdForm.forEach(function (inputAdForm) {
      inputAdForm.disabled = isDisabled;
    });

    return isDisabled;
  };

  var isDisabled = toggleFields(true);

  var activateMap = function () {
    isDisabled = toggleFields(false);
    renderAds(window.data);
  };

  var removePins = function () {
    var mapPinsArray = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

    mapPinsArray.forEach(function (mapPin) {
      mapPins.removeChild(mapPin);
    });
  };

  var disabledMap = function () {
    isDisabled = toggleFields(true);
    removePins();
    mainPinElement.style.left = defoltButtonCoords.x - BUTTON_MIDLE_WIDTH + 'px';
    mainPinElement.style.top = defoltButtonCoords.y + 'px';
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

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newCoord = {
        x: mainPinElement.offsetLeft - shift.x,
        y: mainPinElement.offsetTop - shift.y
      };

      var pinSpikeCoord = {
        x: newCoord.x + BUTTON_MIDLE_WIDTH,
        y: newCoord.y + BUTTON_HEIGHT
      };

      if (pinSpikeCoord.y <= COORD_Y_MAX && pinSpikeCoord.y >= COORD_Y_MIN && pinSpikeCoord.x < mainPinElement.offsetParent.offsetWidth && pinSpikeCoord.x > 0) {
        mainPinElement.style.left = newCoord.x + 'px';
        mainPinElement.style.top = newCoord.y + 'px';
        setCoords(pinSpikeCoord.x, pinSpikeCoord.y);
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
    mapElement: mapElement,
    disabledMap: disabledMap,
    removePins: removePins,
    renderAds: renderAds
  };
})();

