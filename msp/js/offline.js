var locations, pageLength = 7;

$(document).ready(function () {
  $.ajax({
    url: "locations-array-url"
  }).done(function (response) {
    locations = $.parseJSON(response) || [];
    if (locations.length > 0)
      loadMapsScript();
  });

  if ($(".OP-store").length > pageLength) {
    $(".OP-store").slice(pageLength).hide().addClass("hidden");
    $(".offline-pricetable .show-more-stores").show();
  }

  $(".OP-store-thumbs-wrap").on("click", function () {
    $popup = $(".OPS-thumbs-popup");
    var imgSet = $(this).closest(".OP-store-details").data("imgset");
    $popup.find(".OPS-popup-images").each(function (index) {
      $(this).attr("src", imgSet[index]);
    });
    $(".OPS-popups, .OPS-thumbs-popup").fadeIn();
    $("body").css("overflow", "hidden");
  });

  $(".OPS-popup-close, .OPS-popups-bg").on("click", function () {
    $(".OPS-popups, .OPS-popup").fadeOut();
    $("body").css("overflow", "auto");
    return false;
  });

  $(".OP-store-call").on("click", function () {
    $popup = $(".OPS-call-popup");
    $store = $(this).closest(".OP-store-details");
    $popup.find(".OPS-popup-store-name").text($store.find(".OP-store-name").text());
    $popup.find(".OPS-popup-store-address").text($store.find(".OP-store-address").text());
    $popup.find(".OPS-popup-store-number:first").text($store.data("phones")[0]);
    $popup.find(".OPS-popup-store-number:last").text($store.data("phones")[1]);
    $(".OPS-popups, .OPS-call-popup").fadeIn();
    $("body").css("overflow", "hidden");
  });

  $(".OPS-thumbs-popup .OPS-popup-controls .OPS-popup-left, .OPS-thumbs-popup .OPS-popup-controls .OPS-popup-right").on("click", function () {
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

  $(".offline-pricetable .show-more-stores").on("click", function () {
    $(".OP-store.hidden").slice(0, pageLength).removeClass("hidden").slideDown("slow");
    if ($(".OP-store.hidden").length === 0)
      $(this).hide();
  });
});

function loadMapsScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&region=IN&callback=initializeMaps";
  document.body.appendChild(script);
}

function initializeMaps() {
  function getMapCenter() {
    var _x = 0, _y = 0;
    for (i = 0; i < locations.length; i++) {
      _x += locations[i][1];
      _y += locations[i][2];
      if (i == locations.length - 1) {
        center_x = (_x / locations.length);
        center_y = (_y / locations.length);
        return { "x": center_x, "y": center_y };
      }
    }
  }
  var mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(getMapCenter().x, getMapCenter().y),
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE
    }
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  setMarkers(map, locations);
}

function setMarkers(map, locations) {
  var markers = [], infowindows = [], i;
  for (i = 0; i < locations.length; i++) {
    var _store = locations[i][0];
    var lat = locations[i][1];
    var long = locations[i][2];
    var _place = locations[i][3];
    latlngset = new google.maps.LatLng(lat, long);
    markers[i] = new google.maps.Marker({
      id: i,
      map: map,
      title: _store,
      position: latlngset
    });
    infowindows[i] = new google.maps.InfoWindow();
    markers[i].html = "<span style='text-transform:capitalize;'><b>" + _store + "</b>, " + _place + "</span>";
    google.maps.event.addListener(markers[i], 'mouseover', function () {
      infowindows[this.id].setContent(this.html);
      infowindows[this.id].open(map, this);
    });
    google.maps.event.addListener(markers[i], 'mouseout', function () {
      infowindows[this.id].close();
    });
  }
}