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

  var typeNewAd = form.querySelector('#type');
  var priceNewAd = form.querySelector('#price');

  var priceInvalid = function (number) {
    if (number === '') {
      number = 0;
    }
    priceNewAd.style.border = +number < priceNewAd.min || +number > priceNewAd.max ? '2px solid red' : '';
  };

  var checkInvalidpriceHandler = function (evt) {
    priceInvalid(evt.target.value);
  };

  var checkInvalidtypeHandler = function (evt) {
    var type = evt.target.value;
    priceNewAd.min = minPriceTypes[type];
    priceNewAd.placeholder = minPriceTypes[type];

    priceInvalid(priceNewAd.value);
  };

  typeNewAd.addEventListener('change', checkInvalidtypeHandler);
  priceNewAd.addEventListener('change', checkInvalidpriceHandler);

  var timeinNewAd = form.querySelector('#timein').options;
  var timeoutNewAd = form.querySelector('#timeout').options;

  form.querySelector('#timein').addEventListener('change', function () {
    timeoutNewAd.selectedIndex = timeinNewAd.selectedIndex;
  });

  form.querySelector('#timeout').addEventListener('change', function () {
    timeinNewAd.selectedIndex = timeoutNewAd.selectedIndex;
  });

  var roomNumberNewAd = form.querySelector('#room_number');
  var capacityNewAd = form.querySelector('#capacity');

  var madeDisabledCapacity = function () {
    var roomNumberValue = roomNumberNewAd.value;

    if (roomNumberValue === '100') {
      capacityNewAd.options[3].disabled = false;
      for (var i = 0; i < capacityNewAd.options.length - 1; i++) {
        capacityNewAd.options[i].disabled = true;
      }
    } else {
      for (i = 0; i < capacityNewAd.options.length; i++) {
        if (capacityNewAd.options[i].value <= roomNumberValue) {
          capacityNewAd.options[i].disabled = false;
        } else {
          capacityNewAd.options[i].disabled = true;
        }
      }
      capacityNewAd.options[3].disabled = true;
    }
  };

  var madeErrorCapacity = function () {
    var capacityIndex = capacityNewAd.options.selectedIndex;
    var capacityOption = capacityNewAd.options[capacityIndex];
    capacityNewAd.style.border = capacityOption.disabled ? '2px solid red' : '';
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

  var getsuccessHandler = function () {
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
      window.backend.upload(new FormData(form), getsuccessHandler, getErrorHandler);
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
