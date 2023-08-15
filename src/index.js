import $ from "jquery";
import "select2";
import "@/styles/index.scss";

(function ($) {
  const dataInfo = {
    game: {
      EU: { price: 10 },
      DE: { price: 15 },
    },
  };

  let iconDefault = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="11" viewBox="0 0 20 11" fill="none">
                      <path d="M0 0.699997L10 10.7L20 0.699997H0Z"/>
                    </svg>`;

  let iconActive = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9.741 17.8021C9.50831 17.8021 9.29501 17.7168 9.1205 17.5248L5.26177 13.2802C4.91274 12.8963 4.91274 12.299 5.26177 11.9151C5.6108 11.5312 6.15374 11.5312 6.50277 11.9151L9.76039 15.4771L17.4972 6.98795C17.8463 6.60401 18.3892 6.60401 18.7382 6.98795C19.0873 7.37188 19.0873 7.96911 18.7382 8.35304L10.3809 17.5248C10.187 17.7168 9.97368 17.8021 9.741 17.8021Z" fill="#46CA43"/>
                    </svg>`;

  const $serverInfo = $(".server");
  const $currencySelect = $(".currency-selectJS");
  const $groupSelect = $(".groupJS");
  const $sliderInput = $("input[type=range]");
  const $priceInput = $("input[type=number]");
  const $priceCounter = $(".form__counter");

  function initializeSelect2($element, placeholder) {
    $element.select2({
      placeholder: placeholder,
      minimumResultsForSearch: -1,
      width: "100%",
      theme: "custom",
    });
  }

  initializeSelect2($serverInfo, "Currency");
  initializeSelect2($currencySelect, "Server");
  initializeSelect2($groupSelect, "Fraction");
  console.log("Klasn Test");
  function handleSelect2Select($elements) {
    $elements.prop("disabled", false);
    $(this).next().addClass("select2-container--active");
    setIconBasedOnActiveState($(this));
  }

  $serverInfo.on("select2:select", function () {
    $currencySelect.add($priceInput).prop("disabled", false);
    updatePriceCounter();
    $(this).next().addClass("select2-container--active");
    setIconBasedOnActiveState($(this));
  });

  $currencySelect.on("select2:select", function () {
    $groupSelect.prop("disabled", false);
    $(this).next().addClass("select2-container--active");
    setIconBasedOnActiveState($(this));
  });

  $groupSelect.on("select2:select", function () {
    $sliderInput.add($priceInput).prop("disabled", false);
    $(this).next().addClass("select2-container--active");
    updatePriceCounter();
    setIconBasedOnActiveState($(this));
    $(".form__currency-confirm__button").prop("disabled", false);
  });

  $(".form__currency-confirm__button").on("click", function () {
    $(".form__currency-submit").removeClass("is--hidden");
  });

  $(".form__currency-submit__close").on("click", function () {
    $(".form__currency-submit").addClass("is--hidden");
  });

  $(".form__currency-submit__input").on("input", function () {
    const sanitizedValue = $(this)
      .val()
      .replace(/[^a-zA-Z]/g, "");
    $(this).val(sanitizedValue);
  });

  $(document)
    .find(".select2")
    .each(function () {
      setIconBasedOnDisabledState($(this));
    });

  $sliderInput.attr("min", 100).attr("max", 1000);

  function updateRangeBackgroundImage() {
    const rangeValue = parseInt($sliderInput.val());
    const val =
      (rangeValue - $sliderInput.attr("min")) /
      ($sliderInput.attr("max") - $sliderInput.attr("min"));
    const percent = val * 100;

    $sliderInput.css(
      "background-image",
      `-webkit-gradient(linear, left top, right top, 
        color-stop(${percent}%, #46CA43), 
        color-stop(${percent}%, #414D60)`
    );

    $sliderInput.css(
      "background-image",
      `-moz-linear-gradient(left center, #46CA43 0%, #46CA43 ${percent}%, #414D60 ${percent}%, #414D60 100%)`
    );

    // Update the currency counter
    updatePriceCounter();
  }

  function updatePriceCounter() {
    const selectedCurrency = $serverInfo.val();
    const gamePrice = dataInfo.game[selectedCurrency].price;
    const rangeValue = parseFloat($sliderInput.val());
    const calculatedTotal = (gamePrice * rangeValue) / 10;

    $priceCounter.text(`${calculatedTotal}`);
    $priceInput.val(calculatedTotal.toFixed(2) / 10);
  }

  $sliderInput.on("input", updateRangeBackgroundImage);

  $priceInput.on("input", function () {
    if ($(this).val() === "") return;

    const inputValue = parseFloat($(this).val());
    const gamePrice = dataInfo.game[$serverInfo.val()].price;
    const rangeValue = (inputValue * 100) / gamePrice;
    const val =
      (rangeValue - $sliderInput.attr("min")) /
      ($sliderInput.attr("max") - $sliderInput.attr("min"));
    const percent = val * 100;

    $sliderInput.val(rangeValue);

    $sliderInput.css(
      "background-image",
      `-webkit-gradient(linear, left top, right top, 
        color-stop(${percent}%, #46CA43), 
        color-stop(${percent}%, #414D60)`
    );

    $sliderInput.css(
      "background-image",
      `-moz-linear-gradient(left center, #46CA43 0%, #46CA43 ${percent}%, #414D60 ${percent}%, #414D60 100%)`
    );

    // Update the currency counter
    updatePriceCounter();
  });

  function setIconBasedOnDisabledState($select2Element) {
    $select2Element.find(".select2-selection__arrow").html(iconDefault);
  }

  function setIconBasedOnActiveState($select2Element) {
    $select2Element.next().find(".select2-selection__arrow").html(iconActive);
  }
})(jQuery);
