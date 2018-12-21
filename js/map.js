'use strict';
// map.js
(function () {

  var BUTTON_MIDLE_WIDTH = Math.round(65 / 2);
  var BUTTON_HEIGHT = 62;
  var BUTTON_HEIGHT_END = BUTTON_HEIGHT + 22;
  var MAX_VALUE_PINS = 5;

  var COORD_Y_MAX = 630;
  var COORD_Y_MIN = 130;

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

  inputAddress.value = Math.round(document.body.clientWidth / 2) + ', ' + Math.round(mapElement.clientHeight / 2);

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

    // for (var i = 0; i < adFormElements.length; i++) {
    //   adFormElements[i].disabled = isDisabled;
    // }
    // for (i = 0; i < inputsAdForm.length; i++) {
    //   inputsAdForm[i].disabled = isDisabled;
    // }
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

    // for (var i = 0; i < mapPinsArray.length; i++) {
    //   mapPins.removeChild(mapPinsArray[i]);
    // }
  };

  var disabledMap = function () {
    isDisabled = toggleFields(true);
    removePins();
    mainPinElement.style.left = Math.round(document.body.clientWidth / 2) - BUTTON_MIDLE_WIDTH + 'px';
    mainPinElement.style.top = Math.round(mapElement.clientHeight / 2) + 'px';
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

      if (
        newCoord.y <= COORD_Y_MAX && newCoord.y >= COORD_Y_MIN && newCoord.x + BUTTON_MIDLE_WIDTH * 2 < mainPinElement.offsetParent.offsetWidth && newCoord.x > 0) {
        mainPinElement.style.left = newCoord.x + 'px';
        mainPinElement.style.top = newCoord.y + 'px';
        setCoords(newCoord.x, newCoord.y);
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

