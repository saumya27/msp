var autocomplete,
    pageLength = 7,
    mspid = $("#mspSingleTitle").data("mspid"),
    $offlinePriceTable = $(".OP-storelist-wrap"),
    $showMoreStores = $(".offline-pricetable .show-more-stores"),
    isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;

$(document).ready(function () {
  if (getCookie("msp_show_offline") === "1") {
    $(".offlinelinks").show();
    if ($('.store_pricetable').length)
      _gaq.push(['_trackEvent', 'Offline_Desktop', 'tab_shown', mspid.toString()]);
  }

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
      if ((isChrome && localStorage && localStorage.userLatitude) || (sessionStorage && sessionStorage.userLatitude))
        $userLocationButton.click();
    }
    else
      _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'not_supported']);

    initAutocomplete();

    // Track how many people are scrolling down to the offline price table
    var $opt = $(".offline-pricetable");
    if ($opt.length) {
      $(window).on("scroll", function (e) {
        if ($opt.offset().top - $("body").scrollTop() < $(window).height() / 2) {
          _gaq.push(["_trackEvent", "Offline_Desktop", "Pricetable_Shown", mspid.toString()]);
          $(this).off(e);
        }
      });
    }

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

    $("body").on("click", ".OP-store-call, .hiddenstorelogo", function () {
      $(".OP-store-call.popup-opened").removeClass("popup-opened");
      $(this).closest('.OP-store').find('.OP-store-call').addClass("popup-opened");
      //$(this).addClass("popup-opened");
      var $popup = $(".OPS-call-popup"),
          $store = $(this).closest(".OP-store-details"),
          storeid = $store.data("id"),
          phones = $store.data("phones");
      $popup.find(".OPS-contact-form").show().find("input[type='text']").val("");
      //$popup.find(".OPS-popup-store-name, .OPS-contact-form .OPS-popup-title span").text($store.find(".OP-store-name").data("name"));
      $popup.find(".OPS-popup-store-name, .OPS-contact-form .OPS-popup-title span").text("Get Store Details");
      $popup.find(".OPS-popup-store-address").text($.trim($store.find(".OP-store-address").text()));
      $popup.find(".OPS-popup-store-number").first().text(phones[0]);
      $popup.find(".OPS-popup-store-number").last().text(phones[1]);
      $(".OPS-popups, .OPS-call-popup").fadeIn(400, function () {
        $("#OPS-name-input").focus();
      });
      $("body").css("overflow", "hidden");
      $.ajax({
        url: "/offline/offline_call.php",
        data: {
          "mspid": mspid,
          "storeid": storeid
        }
      });
      _gaq.push(["_trackEvent", "Offline_Desktop", "call_click", storeid.toString()]);
      return false;
    });

    $("body").on("submit", ".OPS-call-popup .OPS-contact-form", function () {
      var $this = $(this);
      $this.find("input[type='text']").removeClass("error");
      var $input = $("#OPS-name-input"),
          nameValue = $.trim($input.val());
      if (!nameValue) {
        $input.addClass("error").focus();
        return false;
      }
      $input = $("#OPS-phone-input");
      var mobileValue = $input.val(),
          mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(mobileValue)) {
        $input.addClass("error").focus();
        return false;
      }
      var $title = $("#mspSingleTitle"),
          $selectedStore = $(".OP-store-call.popup-opened").closest(".OP-store-details"),
          selectedStoreIndex = $selectedStore.closest(".OP-store").index(),
          // If selected store is best price store, recommended store is second-best price store;
          // if selected store is not best price store, recommended store is best price store
          recommendedStoreIndex = selectedStoreIndex === 0 ? 1 : 0,
          $recommendedStore = $(".OP-store").eq(recommendedStoreIndex).find(".OP-store-details");
      $.ajax({
        type: "POST",
        url: "/offline/send_sms.php",
        data: {
          "mspid": $title.data("mspid"),
          "product_name": $title.text(),
          "user_name": nameValue,
          "user_mobile": mobileValue,
          "selected_store": getStoreDetails($selectedStore),
          "recommended_store": getStoreDetails($recommendedStore),
          "source":"desktop"
        }
      });
      $this.fadeOut();
      $(".imgBox").css('background-image', 'none');
      $(".imgBox > p").css("visibility", "visible");
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
      $("html, body").animate({
        scrollTop: $offlinePriceTable.find(".OP-store").not(".hidden").last().offset().top - $(".main-header").outerHeight()
      });
      $offlinePriceTable.find(".OP-store.hidden").slice(0, pageLength).removeClass("hidden");
      if (!$offlinePriceTable.find(".OP-store.hidden").length)
        $showMoreStores.hide();
    });

    if($("#tab_price").hasClass("selected"))
    {
      var offline_heading = $('.priceindia').text().replace('Price','Offline Price');
      $('.offline-pricetable').prepend($('.priceindia').clone().text(offline_heading));
    }

    getPriceLines(0, 0);
});

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(document.getElementById("OP-search-input"), {
    componentRestrictions: { country: "in" },
    types: ["geocode"]
  });
  google.maps.event.addListener(autocomplete, "place_changed", locationChanged);
}

function getPriceLines(lat, lng) {
  var $overlay = $offlinePriceTable.find(".OP-storelist-overlay"),
      $title = $(".OP-static-map .OP-section-title"),
      onlinePrice = parseInt($(".price_online .action_value").text().replace(/\D/g, ""), 10),
      data = {
        "mspid": mspid,
        "lat": lat,
        "lng": lng,
        "mrp": $(".product_pricebox .stupid_price").data("value") || 0,
        "onlineprice": isNaN(onlinePrice) ? 0 : onlinePrice
      };
  $showMoreStores.hide();
  $overlay.show();
  if (qS && qS.source)
    data.source = qS.source;
  if($(".offlineExperiment")[0]) {
    pturl = "/offline/offlinepricetable_tmp.php"
  } else {
    pturl = "/offline/offlinepricetable.php"
  } 
  $.ajax({
    "url": pturl,
    "dataType": "json",
    "data": data
  }).done(function (json) {
    if (json) {
      if (json.offlineprice) {
        $(".product_topsec_det .prod_tag").remove();
        $(".price_offline").show().find(".action_value").html(json.offlineprice);
        $("#pricealertbutton").removeClass("btn-disabled").addClass("popup-target callout-target");
      }
      else
        $(".price_offline").hide();
      if (json.bestprice)
        $(".product_pricebox .smart_price").html(json.bestprice);
      if (json.discount)
        $(".product_pricebox .discount_value").text(json.discount);
      if (json.buybutton)
        $("#buybutton").replaceWith(json.buybutton);
      $offlinePriceTable.find(".OP-store").remove();
      if (json.pricetable) {
        $offlinePriceTable.prepend(json.pricetable).find(".OP-store").slice(0, $("#tab_price").hasClass("selected") ? 3 : pageLength).removeClass("hidden");
        if ($offlinePriceTable.find(".OP-store.hidden").length)
          $showMoreStores.show();
        $title.text("STORES AROUND YOU");
      }
      else
        $title.text("NO STORES AROUND YOU");
    }
    else
      $showMoreStores.show();
  }).fail(function () {
    $showMoreStores.show();
  }).always(function () {
    $overlay.hide();
  });
}

function getStoreDetails(store) {
  if (store && store.length) {
    return {
      "store_id": store.data("id"),
      "name": store.find(".OP-store-name").data("name"),
      "price": store.data("price"),
      "address": $.trim(store.find(".OP-store-address-val").text()),
      "area": $.trim(store.find(".OP-store-area").text()),
      "pincode": $.trim(store.find(".OP-store-pin-code").text()),
      "offer": $.trim(store.find(".OP-store-offer").text()),
      "phone": store.data("phones")[0]
    };
  }
  else
    return "";
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