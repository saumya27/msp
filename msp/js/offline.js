var pageLength = 7, markers = [], infoWindows = [], mspid = $("#mspSingleTitle").data("mspid"), map, autocomplete,
    $offlinePriceTable = $(".OP-storelist-wrap"), $showMoreStores = $(".offline-pricetable .show-more-stores"),
    userLat, userLong, userMarker;

$(document).ready(function () {
  if (getCookie("msp_show_offline") === "1") {
    $(".offlinelinks").show();
    if ($('.store_pricetable').length) {
      _gaq.push(['_trackEvent', 'offline', 'tab_shown']);
    }
  }

  if (!$("#tab_price").hasClass("selected")) {
    getUserLocation();

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
          phones = $store.data("phones");
      $popup.find(".OPS-popup-store-name").text($store.find(".OP-store-name").data("name"));
      $popup.find(".OPS-popup-store-address").text($.trim($store.find(".OP-store-address").text()));
      $popup.find(".OPS-popup-store-number:first").text(phones[0]);
      $popup.find(".OPS-popup-store-number:last").text(phones[1]);
      $(".OPS-popups").fadeIn();
      $popup.fadeIn();
      $("body").css("overflow", "hidden");
      $.ajax({
        url: "/offline/offline_call.php?mspid=" + encodeURIComponent($("#mspSingleTitle").data("mspid")) + "&storeid=" + encodeURIComponent($store.data("id"))
      });
      _gaq.push(["_trackEvent", "offline", "call_click", $(this).data("store")]);
      return false;
    });

    $("body").on("click", ".OP-store-sms", function () {
      $(".OP-store-sms.popup-opened").removeClass("popup-opened");
      $(this).addClass("popup-opened");
      $(".OPS-popups, .OPS-sms-popup").fadeIn(400, function () {
        $(".OPS-sms-popup #OPS-sms-phone").focus();
      });
      $("body").css("overflow", "hidden");
      _gaq.push(["_trackEvent", "offline", "sms_click", $(this).data("store")]);
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
        if (this_id == 1 && change == -1) {
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(_imgs - 1).show().addClass("active");
        } else if (this_id != 1 && change == -1) {
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(this_id - 2).show().addClass("active");
        } else if (this_id == _imgs && change == 1) {
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(0).show().addClass("active");
        } else {
          $(".OPS-popup-viewer").find(".OPS-popup-images-wrap").eq(this_id).show().addClass("active");
        }
      });
      return false;
    });

    $("body").on("click", ".offline-pricetable .show-more-stores", function () {
      var shownCount = $offlinePriceTable.find(".OP-store").not(".hidden").length;
      $offlinePriceTable.find(".OP-store.hidden").slice(0, pageLength).removeClass("hidden");
      if (!$offlinePriceTable.find(".OP-store.hidden").length)
        $showMoreStores.hide();
      fitMapBounds();
      setMarkers(shownCount);
    });
  }
});

function getUserLocation() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);
  else
    locationFail();
}

function locationSuccess(position) {
  _gaq.push(['_trackEvent', 'offline','location', 'allow']);
  userLat = position.coords.latitude;
  userLong = position.coords.longitude;
  getData(position.coords.latitude, position.coords.longitude, initializeMap);
}

function locationFail() {
_gaq.push(['_trackEvent', 'offline','location', 'deny']);
  getData(0, 0, initializeMap);
}

function getData(lat, lng, mapFunc) {
  $.ajax({
    url: "/offline/offlinepricetable.php?mspid=" + encodeURIComponent(mspid) + "&lat=" + encodeURIComponent(lat) + "&lng=" + encodeURIComponent(lng)
  }).done(appendPriceLines, mapFunc);
}

function appendPriceLines(html) {
  $offlinePriceTable.append(html);
  $offlinePriceTable.find(".OP-store").slice(0, pageLength).removeClass("hidden");
  if ($offlinePriceTable.find(".OP-store.hidden").length)
    $showMoreStores.show();
}

function initializeMap() {
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
      style: google.maps.ZoomControlStyle.LARGE
    },
    minZoom: 10
  });
  fitMapBounds();

  autocomplete = new google.maps.places.Autocomplete(document.getElementById("OP-search-input"), {
    componentRestrictions: { country: "in" },
    types: ["geocode"]
  });
  autocomplete.bindTo("bounds", map);
  google.maps.event.addListener(autocomplete, "place_changed", locationChanged);
    //setting user marker
  userMarker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      title: 'You',
      icon: 'http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/map-user-pin.png',
      position: { lat: userLat, lng: userLong }
  });
  infoWindows['user'] = new google.maps.InfoWindow({
      content: "<div class='OP-gmaps-infowindow'><strong>You</strong></div>"
    });
  google.maps.event.addListener(userMarker, "click", function () {
      for (var i = 0; i < markers.length; i++) {
          infoWindows[i].close();
      }

      infoWindows['user'].open(map, this);
    });
    /*  
    var userCircle = {
      strokeColor: '#0000FF',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: '#0000FF',
      fillOpacity: 0.05,
      map: map,
      center: new google.maps.LatLng(userLat, userLong),
      radius: 9000
    };
    new google.maps.Circle(userCircle);
    */
  setMarkers();
}

function fitMapBounds() {
  function sortArray(a, b) {
    return a - b;
  }
  var lats = [], lngs = [];
  $offlinePriceTable.find(".OP-store").not(".hidden").each(function () {
    var coords = $(this).find(".OP-store-details").data("coords");
    lats.push(coords[0]);
    lngs.push(coords[1]);
  });
  lats.sort(sortArray);
  lngs.sort(sortArray);
  var southWest = new google.maps.LatLng(lats[0], lngs[0]),
      northEast = new google.maps.LatLng(lats[lats.length - 1], lngs[lngs.length - 1]);
  map.fitBounds(new google.maps.LatLngBounds(southWest, northEast));
}

function setMarkers(offset) {
  var start = parseInt(offset, 10);
  if (isNaN(start))
    start = 0;
  $offlinePriceTable.find(".OP-store").not(".hidden").slice(start).each(function (index) {
    var $this = $(this),
        storeName = $this.find(".OP-store-name").data('name'),
        area = $this.find(".OP-store-area").text(),
        pinCode = $this.find(".OP-store-pin-code").text(),
        coords = $this.find(".OP-store-details").data("coords"),
        lat = coords[0],
        lng = coords[1];
    markers[start + index] = new google.maps.Marker({
      id: start + index,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/map-store-pin.png',
      title: storeName,
      position: { lat: lat, lng: lng }
    });
    infoWindows[start + index] = new google.maps.InfoWindow({
      content: "<div class='OP-gmaps-infowindow'><strong>" + storeName + "</strong><br/>" + area + "<br/>" + pinCode + "</div>"
    });
    google.maps.event.addListener(markers[start + index], "click", function () {
      for (var i = 0; i < markers.length; i++) {
          infoWindows[i].close();
      }

      infoWindows['user'].close();
      infoWindows[this.id].open(map, this);
    });
  });
}

function locationChanged() {
  var place = autocomplete.getPlace();
  if (place) {
    var geometry = place.geometry;
    if (geometry) {
      var location = geometry.location;
      if (location) {
        infoWindows = [];
        clearMarkers();
        $offlinePriceTable.empty();
        $showMoreStores.hide();
        getData(location.lat(), location.lng(), [fitMapBounds, setMarkers]);
      }
    }
  }
}

function clearMarkers() {
  while (markers.length)
    markers.pop().setMap(null);
}