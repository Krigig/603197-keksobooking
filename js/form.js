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

  var invalidCapacity = function () {
    var roomNumberNewAdElement = formElement.querySelector('#room_number');
    var roomNumberValue = roomNumberNewAdElement.value;
    var capacityNewAdElement = formElement.querySelector('#capacity');

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

    var capacityIndex = capacityNewAdElement.options.selectedIndex;
    var capacityOptionElement = capacityNewAdElement.options[capacityIndex];
    capacityNewAdElement.style.border = capacityOptionElement.disabled ? '2px solid red' : '';
  };

  invalidCapacity();
  formElement.querySelector('#room_number').addEventListener('change', invalidCapacity);
  formElement.querySelector('#capacity').addEventListener('change', invalidCapacity);

})();
