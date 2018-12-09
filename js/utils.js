'use strict';

// utils.js
(function () {
  var random = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var randomArray = function (array) {
    return Math.floor(Math.random() * array.length);
  };

  var getRamdomArray = function (arr) {
    var shuffledArray = getShuffledArray(arr);
    var ramdomEnd = random(0, shuffledArray.length - 1);
    return shuffledArray.slice(0, ramdomEnd);
  };

  var getShuffledArray = function (arr) {
    var copyArr = arr.concat();
    copyArr.sort(function () {
      return Math.random() - 0.5;
    });
    return copyArr;
  };

  window.utils = {
    random: random,
    randomArray: randomArray,
    getRamdomArray: getRamdomArray,
    getShuffledArray: getShuffledArray
  };

})();