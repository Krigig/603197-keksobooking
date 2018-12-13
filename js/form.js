'use strict';
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

  var roomNumberNewAdElement = formElement.querySelector('#room_number');
  var capacityNewAdElement = formElement.querySelector('#capacity');

  var madeDisabledCapacity = function () {
    var roomNumberValue = roomNumberNewAdElement.value;

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
  };

  var madeErrorCapacity = function () {
    var capacityIndex = capacityNewAdElement.options.selectedIndex;
    var capacityOptionElement = capacityNewAdElement.options[capacityIndex];
    capacityNewAdElement.style.border = capacityOptionElement.disabled ? '2px solid red' : '';
    return capacityOptionElement.disabled;
  };

  var checkInvalidCapacityHandler = function () {
    madeDisabledCapacity();
    madeErrorCapacity();
  };

  checkInvalidCapacityHandler();
  formElement.querySelector('#room_number').addEventListener('change', checkInvalidCapacityHandler);
  formElement.querySelector('#capacity').addEventListener('change', checkInvalidCapacityHandler);

  var resetHandler = function () {
    formElement.reset();
    window.map.disabledMap();
  };

  var successHandler = function () {
    window.utils.resultSendHandler('success');
    resetHandler();
  };

  var errorHandler = function () {
    window.utils.resultSendHandler('error');
  };

  var btnReset = formElement.querySelector('.ad-form__reset');
  btnReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetHandler();
  });

  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (!madeErrorCapacity()) {
      window.backend.upload(new FormData(formElement), successHandler, errorHandler);
    }
  });
})();
