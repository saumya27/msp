var autocomplete,
    pageLength = 7,
    mspid = $(".prdct-dtl__ttl").data("mspid"),
    $offlinePriceTable = $(".OP-storelist-wrap"),
    $showMoreStores = $(".offline-pricetable .show-more-stores"),
    isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;

$(document).ready(function () {
    if (navigator.geolocation) {
      var $userLocationButton = $(".OP-geolocation-button");
      $userLocationButton.show();
      $("body").on("click", ".OP-geolocation-button", function () {
        if (isChrome && !(localStorage && localStorage.userLatitude) && !(sessionStorage && sessionStorage.userLatitude)) {
          $(".OPS-popups").addClass("modal");
          $(".OPS-popups, .OPS-geolocation-popup").fadeIn();
          $("body").css("overflow", "hidden");
        }
        navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);
      });
      $("body").on("click", ".OPS-geolocation-popup", function () {
        $(".OPS-popups-bg").click();
        $(".OPS-popups").removeClass("modal");
      });
      if ((isChrome && localStorage && localStorage.userLatitude) || (sessionStorage && sessionStorage.userLatitude)) {
        $userLocationButton.click();
      }
    }
    else
      _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'not_supported']);

    initAutocomplete();

    getPriceLines(0, 0);
});

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(document.getElementById("OP-search-input"), {
    componentRestrictions: { country: "in" },
    types: ["geocode"]
  });
  google.maps.event.addListener(autocomplete, "place_changed", locationChanged);
}

function locationSuccess(position) {
  var latitude = position.coords.latitude,
      longitude = position.coords.longitude;
  if (isChrome && localStorage) {
    localStorage.userLatitude = latitude;
    localStorage.userLongitude = longitude;
  }
  else if (sessionStorage) {
    sessionStorage.userLatitude = latitude;
    sessionStorage.userLongitude = longitude;
  }
  _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'allow']);
  $("#OP-search-input").val("Your current location");
  $(".OPS-geolocation-popup").click();
  getPriceLines(latitude, longitude);
}

function locationFail() {
  _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'deny']);
  $(".OPS-geolocation-popup").click();
}

function locationChanged() {
  var place = autocomplete.getPlace();
  if (place) {
    var geometry = place.geometry;
    if (geometry) {
      var location = geometry.location;
      if (location)
        getPriceLines(location.lat(), location.lng());
    }
  }
}