var isChrome = MSP.utils.browser.name === "chrome";

$(document).ready(function() {
    var isLocationStored;
    if (navigator.geolocation) {
        // check if location data stored in localStorage.
        isLocationStored = !!window.localStorage.userLatitude;

        // show geolocation button if geolocation API supported.
        $(".prc-tbl__lctn-gps").show();
        // if chrome, then update localStorage value onload itself.
        if (isChrome && isLocationStored) {
          $(".prc-tbl__lctn-gps").click();
        }

        // get GPS location and update datapoints and pricetable.
        $doc.on("click", ".prc-tbl__lctn-gps", function() {
            isLocationStored = !!window.localStorage.userLatitude;

            /**
             * if chrome and location not available in localStorage,
             * then open overlay to focus permission popup
             */
            if (isChrome && !isLocationStored) {
                $(".js-glctn-ovrly").addClass("js-overlay--show");
                $("body").css("overflow", "hidden");
            }

            navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);
        });

        // clicking on chrome geolocation overlay should remove it.
        $doc.on("click", ".js-glctn-ovrly", function () {
            $(".glctn-ovrly-text").removeClass("js-ovrly--show");
            $("body").css("overflow", "auto");
        });
    } else {
        _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'not_supported']);
    }

    initAutocomplete();
});


function initAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete($(".prc-tbl__lctn-inpt").get(0), {
        componentRestrictions: { country: "in" },
        types: ["geocode"]
    });
    google.maps.event.addListener(autocomplete, "place_changed", function() {
        var place = autocomplete.getPlace();
        if (place && place.geometry && place.geometry.location) {
            PriceTable.updateByCategory(PriceTable.dataPoints.getSelectedCategory(), {
                "latitude" : location.lat(),
                "longitude" : location.lng()
            });
        }
    });
}

function locationSuccess(position) {
    var latitude = position.coords.latitude,
        longitude = position.coords.longitude;

    /**
     * 1. update localStorage values for fallback when permission denied.
     * 2. for chrome - localstorage value is indicator that location permission is available 
     */
    if (localStorage) {
        localStorage.userLatitude = latitude;
        localStorage.userLongitude = longitude;
    }

    // for non-chrome browsers - session storage value -> indicating that location permission available.
    if (!isChrome && sessionStorage) {
        sessionStorage.userLatitude = latitude;
        sessionStorage.userLongitude = longitude;
    }

    // set location input field value to notify user. 
    $(".prc-tbl__lctn-inpt").val("Your current location");
  
    // remove geolocation overlay if present
    $(".js-glctn-ovrly").click();
  
    PriceTable.updateByCategory(PriceTable.dataPoints.getSelectedCategory(), {
        "latitude" : latitude,
        "longitude" : longitude
    });

    if (window._gaq) _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'allow']);
}

function locationFail() {
    // remove geolocation overlay if present
    $(".js-glctn-ovrly").click();

    if (window._gaq)_gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'deny']);
}