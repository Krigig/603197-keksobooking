'use strict';
// form.js
(function () {
  var form = document.querySelector('.ad-form');
  var minPriceTypes = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var typeNewAdElement = form.querySelector('#type');
  var priceNewAdElement = form.querySelector('#price');

  var priceInvalid = function (number) {
    if (number === '') {
      number = 0;
    }
    priceNewAdElement.style.border = +number < priceNewAdElement.min || +number > priceNewAdElement.max ? '2px solid red' : '';
  };

  var checkInvalidpriceHandler = function (evt) {
    priceInvalid(evt.target.value);
  };

  var checkInvalidtypeHandler = function (evt) {
    var type = evt.target.value;
    priceNewAdElement.min = minPriceTypes[type];
    priceNewAdElement.placeholder = minPriceTypes[type];

    priceInvalid(priceNewAdElement.value);
  };

  typeNewAdElement.addEventListener('change', checkInvalidtypeHandler);
  priceNewAdElement.addEventListener('change', checkInvalidpriceHandler);

  var timeinNewAdElement = form.querySelector('#timein').options;
  var timeoutNewAdElement = form.querySelector('#timeout').options;

  form.querySelector('#timein').addEventListener('change', function () {
    timeoutNewAdElement.selectedIndex = timeinNewAdElement.selectedIndex;
  });

  form.querySelector('#timeout').addEventListener('change', function () {
    timeinNewAdElement.selectedIndex = timeoutNewAdElement.selectedIndex;
  });

  var roomNumberNewAdElement = form.querySelector('#room_number');
  var capacityNewAdElement = form.querySelector('#capacity');

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
    var capacityOption = capacityNewAdElement.options[capacityIndex];
    capacityNewAdElement.style.border = capacityOption.disabled ? '2px solid red' : '';
    return capacityOption.disabled;
  };

  var checkInvalidCapacityHandler = function () {
    madeDisabledCapacity();
    madeErrorCapacity();
  };

  checkInvalidCapacityHandler();
  form.querySelector('#room_number').addEventListener('change', checkInvalidCapacityHandler);
  form.querySelector('#capacity').addEventListener('change', checkInvalidCapacityHandler);

  var clickResetHandler = function () {
    form.reset();
    window.map.disabledMap();
  };

  var getSuccessHandler = function () {
    window.utils.resultSendHandler('success');
    clickResetHandler();
  };

  var getErrorHandler = function () {
    window.utils.resultSendHandler('error');
  };

  var btnReset = form.querySelector('.ad-form__reset');
  btnReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    clickResetHandler();
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (!madeErrorCapacity()) {
      window.backend.upload(new FormData(form), getSuccessHandler, getErrorHandler);
    }
  });

  var getPhotosLoad = function (fileChooser, preview, previewWrapper) {
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

    fileChooser.addEventListener('change', function () {

      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          if (preview.src) {
            preview.src = reader.result;
          } else {
            if (previewWrapper.isConnected) {
              preview.removeChild(previewWrapper);
            }
            var newPhotoWrapper = document.createElement('div');
            newPhotoWrapper.className = 'ad-form__photo';
            var newPhoto = document.createElement('img');
            newPhoto.src = reader.result;
            newPhoto.width = 70;
            newPhoto.height = 70;
            newPhoto.style = 'border-radius: 5px';
            newPhotoWrapper.appendChild(newPhoto);
            previewPhotos.appendChild(newPhotoWrapper);
          }
        });

        reader.readAsDataURL(file);
      }

    });
  };

  var fileChooserAvatar = document.querySelector('.ad-form__field input[type=file]');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');

  getPhotosLoad(fileChooserAvatar, previewAvatar);

  var fileChooserPhotos = document.querySelector('.ad-form__upload input[type=file]');
  var previewPhotos = document.querySelector('.ad-form__photo-container');
  var previewPhotoWrapper = document.querySelector('.ad-form__photo');

  getPhotosLoad(fileChooserPhotos, previewPhotos, previewPhotoWrapper);
})();
