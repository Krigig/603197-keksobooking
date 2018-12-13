'use strict';
// map.js
(function () {

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
      if (adsArray[i].hasOwnProperty('offer')) {
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
    renderAds(window.data);
  };

  var disabledMap = function () {
    isDisabled = toggleFields(true);
    var mapPinsArray = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapPinsArray.length; i++) {
      mapPins.removeChild(mapPinsArray[i]);
    }
    mainPinElement.style = 'left: 570px; top: 375px;';
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
    mapElement: mapElement,
    disabledMap: disabledMap,
  };
})();

