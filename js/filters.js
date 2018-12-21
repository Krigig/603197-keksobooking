'use strict';
(function () {
  var MAX_PRICE = 50000;
  var MIN_PRICE = 10000;
  var DEBOUNCE_INTERVAL = 500; // ms

  var formElement = document.querySelector('.map__filters');
  var housingTypeElement = formElement.querySelector('#housing-type');
  var housingPriceElement = formElement.querySelector('#housing-price');
  var housingRoomsElement = formElement.querySelector('#housing-rooms');
  var housingGuestsElement = formElement.querySelector('#housing-guests');

  var getFilteredAds = function () {
    var filteredArr = selectChangeHandler(housingTypeElement, 'type', window.data);
    filteredArr = selectChangeHandler(housingRoomsElement, 'rooms', filteredArr);
    filteredArr = selectChangeHandler(housingGuestsElement, 'guests', filteredArr);
    filteredArr = priceChangeHandler(filteredArr);
    filteredArr = changeFeaturesHandler(filteredArr);
    return filteredArr;
  };

  var priceChangeHandler = function (filteredArr) {
    return filteredArr.filter(function (elem) {
      return getPriceCondition(housingPriceElement.value, elem.offer.price);
    });

  };

  var getPriceCondition = function (value, price) {
    if (value === 'middle') {
      return price > MIN_PRICE && price < MAX_PRICE;
    } else if (value === 'low') {
      return price < MIN_PRICE;
    } else if (value === 'high') {
      return price > MAX_PRICE;
    }
    return true;
  };

  var selectChangeHandler = function (select, key, filteredArr) {
    if (select.value !== 'any') {
      return filteredArr.filter(function (elem) {
        var selectValue = isNaN(Number(select.value)) ? select.value : Number(select.value);
        return elem.offer[key] === selectValue;
      });
    }
    return filteredArr;
  };

  var getAdWithFeaturesNeed = function (featureNeed, filteredArr) {
    return filteredArr.filter(function (elem) {
      var result = false;
      for (var j = 0; j < elem.offer.features.length; j++) {
        if (elem.offer.features[j] === featureNeed) {
          result = true;
          break;
        }
      }
      return result;
    });
  };

  var changeFeaturesHandler = function (filteredArr) {
    var featuresArray = formElement.querySelectorAll('.map__features input:checked');
    featuresArray.forEach(function (feature) {
      var featureNeed = feature.value;
      filteredArr = getAdWithFeaturesNeed(featureNeed, filteredArr);
    });

    return filteredArr;
  };

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var formFilterChangeHandler = debounce(function () {
    window.map.removePins();
    window.cards.removeCard();
    var resultArray = getFilteredAds();
    window.map.renderAds(resultArray);
  });

  formElement.addEventListener('change', formFilterChangeHandler);

  window.filters = formElement;

})();
