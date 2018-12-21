'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var STATUS_SUCCESS = 200;
  var TIMEOUT = 100000;

  var getXHR = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        successHandler(xhr.response);
      } else {
        errorHandler('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT;
    return xhr;
  };

  var load = function (successHandler, errorHandler) {
    var xhr = getXHR(successHandler, errorHandler);
    xhr.open('GET', GET_URL);
    xhr.send();
  };

  var upload = function (data, successHandler, errorHandler) {
    var xhr = getXHR(successHandler, errorHandler);
    xhr.open('POST', POST_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };

})();
