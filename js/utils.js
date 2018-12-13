'use strict';

// utils.js
(function () {
  var ESC_KEY = 27;
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

  var resultSendHandler = function (result) {
    if (result === 'success') {
      var resultTemplate = document.querySelector('#success').content.querySelector('.success');
    } else {
      resultTemplate = document.querySelector('#error').content.querySelector('.error');
    }
    // var resultTemplate = document.querySelector result === 'success' ? ('#success').content.querySelector('.success') : ('#error').content.querySelector('.error')];
    result = resultTemplate.cloneNode(true);
    var removeElementHandler = function () {
      document.querySelector('main').removeChild(result);
      document.removeEventListener('click', removeElementHandler);
    };
    document.addEventListener('click', removeElementHandler);
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEY) {
        removeElementHandler(result);
      }
    });
    document.querySelector('main').appendChild(result);
  };

  window.utils = {
    random: random,
    randomArray: randomArray,
    getRamdomArray: getRamdomArray,
    getShuffledArray: getShuffledArray,
    resultSendHandler: resultSendHandler
  };

})();
