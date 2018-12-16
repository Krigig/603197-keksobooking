'use strict';
(function () {
  var MAX_PRICE = 50000;
  var MIN_PRICE = 10000;

  var form = document.querySelector('.map__filters');
  var housingType = form.querySelector('#housing-type');
  var housingPrice = form.querySelector('#housing-price');
  var housingRooms = form.querySelector('#housing-rooms');
  var housingGuests = form.querySelector('#housing-guests');

  var getFilteredAds = function () {
    var filteredArr = selectValueOfStringChangeHandler(housingType, 'type', window.data);
    filteredArr = selectValueOfNumberChangeHandler(housingRooms, 'rooms', filteredArr);
    filteredArr = selectValueOfNumberChangeHandler(housingGuests, 'guests', filteredArr);
    filteredArr = priceChangeHandler(filteredArr);
    filteredArr = changeFeuturesHandler(filteredArr);
    return filteredArr;
  };

  var priceChangeHandler = function (filteredArr) {
    return filteredArr.filter(function (elem) {
      return getPriceCondition(housingPrice.value, elem.offer.price);
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

  var selectValueOfStringChangeHandler = function (select, key, filteredArr) {
    if (select.value !== 'any') {
      return filteredArr.filter(function (elem) {
        return elem.offer[key] === select.value;
      });
    }
    return filteredArr;
  };

  var selectValueOfNumberChangeHandler = function (select, key, filteredArr) {
    if (select.value !== 'any') {
      return filteredArr.filter(function (elem) {
        return elem.offer[key] === +select.value;
      });
    }
    return filteredArr;
  };

  var getAdWithfeaturesNeed = function (featureNeed, filteredArr) {
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

  var changeFeuturesHandler = function (filteredArr) {
    var featuresArray = form.querySelectorAll('.map__features input:checked');
    for (var i = 0; i < featuresArray.length; i++) {
      var featureNeed = featuresArray[i].value;
      filteredArr = getAdWithfeaturesNeed(featureNeed, filteredArr);
    }

    return filteredArr;
  };

  var DEBOUNCE_INTERVAL = 500; // ms

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
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

  form.addEventListener('change', formFilterChangeHandler);

})();
