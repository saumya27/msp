var pageLength = 7, mspid = $("#mspSingleTitle").data("mspid"), autocomplete,
    $offlinePriceTable = $(".OP-storelist-wrap"), $showMoreStores = $(".offline-pricetable .show-more-stores");

$(document).ready(function () {
  if (getCookie("msp_show_offline") === "1") {
    $(".offlinelinks").show();
    if ($('.store_pricetable').length)
      _gaq.push(['_trackEvent', 'Offline_Desktop', 'tab_shown', mspid]);
  }

  if (!$("#tab_price").hasClass("selected")) {
    if (navigator.geolocation) {
      $(".OP-geolocation-button").show();
      $("body").on("click", ".OP-geolocation-button", function () {
        var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
        if (isChrome) {
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
    }
    else
      _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'not_supported']);

    initAutocomplete();

    $("body").on("click", ".OP-store-thumbs-wrap", function () {
      var $popup = $(".OPS-thumbs-popup"),
          imgSet = $(this).closest(".OP-store-details").data("imgset");
      $popup.find(".OPS-popup-images").each(function (index) {
        $(this).attr("src", imgSet[index]);
      });
      $(".OPS-popups").fadeIn();
      $popup.fadeIn();
      $("body").css("overflow", "hidden");
    });

    $("body").on("click", ".OPS-popup-close, .OPS-popups-bg", function () {
      if (!$(".OPS-popups-bg").hasClass("disabled")) {
        $(".OPS-popups, .OPS-popup").fadeOut();
        $("body").css("overflow", "auto");
      }
      return false;
    });

    $("body").on("click", ".OP-store-call", function () {
      var $popup = $(".OPS-call-popup"),
          $store = $(this).closest(".OP-store-details"),
          storeid = $store.data("id"),
          phones = $store.data("phones");
      $popup.find(".OPS-popup-store-name").text($store.find(".OP-store-name").data("name"));
      $popup.find(".OPS-popup-store-address").text($.trim($store.find(".OP-store-address").text()));
      $popup.find(".OPS-popup-store-number").first().text(phones[0]);
      $popup.find(".OPS-popup-store-number").last().text(phones[1]);
      $(".OPS-popups").fadeIn();
      $popup.fadeIn();
      $("body").css("overflow", "hidden");
      $.ajax({
        url: "/offline/offline_call.php",
        data: {
          "mspid": mspid,
          "storeid": storeid
        }
      });
      _gaq.push(["_trackEvent", "Offline_Desktop", "call_click", storeid]);
      return false;
    });

    $("body").on("click", ".OP-store-sms", function () {
      $(".OP-store-sms.popup-opened").removeClass("popup-opened");
      $(this).addClass("popup-opened");
      $(".OPS-popups, .OPS-sms-popup").fadeIn(400, function () {
        $(".OPS-sms-popup #OPS-sms-phone").focus();
      });
      $("body").css("overflow", "hidden");
      _gaq.push(["_trackEvent", "Offline_Desktop", "sms_click", $(this).closest(".OP-store-details").data("id")]);
      return false;
    });

    $("body").on("click", ".OPS-sms-popup .btn", function () {
      var $input = $(".OPS-sms-popup #OPS-sms-phone"),
          regEx = /^\d{10}$/,
          phone = $input.val();
      $input.removeClass("error");
      if (regEx.test(phone)) {
        var $title = $("#mspSingleTitle"),
            $smsButton = $(".OP-store-sms.popup-opened"),
            $store = $smsButton.closest(".OP-store-details");
        $.ajax({
          type: "POST",
          url: "/offline/send_sms.php",
          data: {
            "mspid": $title.data("mspid"),
            "product_name": $title.text(),
            "store_id": $store.data("id"),
            "store_name": $store.find(".OP-store-name").data("name"),
            "store_price": $store.data("price"),
            "store_address": $.trim($store.find(".OP-store-address-val").text()),
            "store_area": $.trim($store.find(".OP-store-area").text()),
            "store_pincode": $.trim($store.find(".OP-store-pin-code").text()),
            "offer": $.trim($store.find(".OP-store-offer").text()),
            "phone_number": phone,
            "store_phone": $store.data("phones")[0]
          }
        }).done(function (response) {
          if (response === "SUCCESS") {
            $(".OPS-popups-bg").addClass("disabled");
            $(".OPS-sms-popup .success").fadeIn(400, function () {
              setTimeout(function () {
                $(".OPS-popups-bg").removeClass("disabled");
                $(".OPS-popups, .OPS-sms-popup").fadeOut(400, function () {
                  $("body").css("overflow", "auto");
                  $(".OPS-sms-popup .success").hide();
                });
              }, 2000);
            });
            $smsButton.remove();
          }
        });
      }
      else
        $input.addClass("error").focus();
      return false;
    });

    $("body").on("click", ".OPS-thumbs-popup .OPS-popup-left, .OPS-thumbs-popup .OPS-popup-right", function () {
      var _imgs = $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").length;
      var this_id = Number($(".OPS-popup-viewer").find(".active").data("id"));
      var change = $(this).hasClass("OPS-popup-left") ? -1 : 1;
      $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").hide().removeClass("active");
      $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").each(function () {
        if (this_id == 1 && change == -1)
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(_imgs - 1).show().addClass("active");
        else if (this_id != 1 && change == -1)
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(this_id - 2).show().addClass("active");
        else if (this_id == _imgs && change == 1)
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(0).show().addClass("active");
        else
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(this_id).show().addClass("active");
      });
      return false;
    });

    $("body").on("click", ".offline-pricetable .show-more-stores", function () {
      $offlinePriceTable.find(".OP-store.hidden").slice(0, pageLength).removeClass("hidden");
      if (!$offlinePriceTable.find(".OP-store.hidden").length)
        $showMoreStores.hide();
    });

    getPriceLines(0, 0);
  }
});

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(document.getElementById("OP-search-input"), {
    componentRestrictions: { country: "in" },
    types: ["geocode"]
  });
  google.maps.event.addListener(autocomplete, "place_changed", locationChanged);
}

function getPriceLines(lat, lng) {
  $.ajax({
    url: "offline/offlinepricetable.php",
    data: {
      "mspid": mspid,
      "lat": lat,
      "lng": lng
    }
  }).done(function (html) {
    $offlinePriceTable.append(html);
    $offlinePriceTable.find(".OP-store").slice(0, pageLength).removeClass("hidden");
    if ($offlinePriceTable.find(".OP-store.hidden").length)
      $showMoreStores.show();
  });
}

function locationSuccess(position) {
  _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'allow']);
  $(".OPS-geolocation-popup").click();
  refreshPriceLines(position.coords.latitude, position.coords.longitude);
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
        refreshPriceLines(location.lat(), location.lng());
    }
  }
}

function refreshPriceLines(lat, lng) {
  $offlinePriceTable.empty();
  $showMoreStores.hide();
  getPriceLines(lat, lng);
}