var gPriceMax, gPriceMin, prevMaxPrice, prevMinPrice, startInr, endInr, searchTerm, querySortUrl, queryPageUrl, queryPropertyUrl, queryPriceUrl, isNoHash, initHash, requestStat, xhrdata, initLoad = false;
(function($) {
    $.QueryString = (function(a) {
        if (a === "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));
})(jQuery);

$(document).ready(function() {
    //For adding a cookie if utm_source is availble.
    console.log($.QueryString['utm_source']);
    if ($.QueryString["utm_source"]) {
        console.log($.QueryString['utm_source']);
        setCookie("utm_source", $.QueryString['utm_source']);
    }

    $("body").on("click", "#viewallbestsellers", function() {
        $("#showonlybestsellers").click();
    });
    $("body").on("keyup", ".filterSearch", function() {
        var h = $.trim($(this).val()),
            filterBlock = $(this).closest(".list_filter");
        if (h === "") {
            filterBlock.find(".list_filter_val").show();
            filterBlock.find(".searchClear").hide();
            filterBlock.find(".nano").nanoScroller();
        } else {
            filterBlock.find(".list_filter_val").hide();
            filterBlock.find(".searchClear").show();
            $.expr[':'].icontains = function(a, b, c, d) {
                var e = ($.trim(jQuery(a).text()) || '').toLowerCase();
                var f = false;
                var g = e.indexOf(c[3].toLowerCase());
                if (g === 0) f = true;
                else if (g > 0) {
                    if (e.toLowerCase().charAt(g - 1) === " ") f = true;
                }
                return f;
            };
            filterBlock.find(".list_filter_val:icontains(" + h + ")").show();
            filterBlock.find(".nano").nanoScroller();
        }
    });
    $(".filterbox").on("click", ".searchClear", function() {
        $(this).closest(".filterSearchCont").find(".filterSearch").val("");
        $(this).hide();
        var a = $(this).closest(".list_filter");
        a.find(".list_filter_val").show();
        a.find(".searchClear").hide();
        a.find(".nano").nanoScroller();
    });
    $("body").on("click", ".list_filter_val.multi:not(.price_val, .unavailable)", function() {
        var a = $(this).attr('value');
        var b = $(this).attr('dispname');
        if (!$(this).hasClass('active')) {
            addTag(a, b);
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
            deletePropTag(a);
        }
        showHideReset();
        removeInitialText();
    });
    $("body").on("click", ".list_filter_val.single:not(.price_val, .unavailable)", function() {
        var a = $(this).attr('value');
        var b = $(this).attr('dispname');
        var c = $(this).attr('groupname');
        if (!$(this).hasClass('active')) {
            $(this).parent().children(".list_filter_val.active").each(function() {
                deletePropTag($(this).attr('value'));
            });
            $(this).parent().children().removeClass("active");
            addTag(a, b);
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
            deletePropTag(a);
        }
        showHideReset();
        removeInitialText();
    });
    $("body").on("click", ".list_filter_val.single.price_val:not(.unavailable)", function() {
        var a = $(this).attr('value'),
            value = a.split(";"),
            minPrice = parseInt(value[0], 10),
            maxPrice = parseInt(value[1], 10);
        if (!$(this).hasClass('active')) {
            $(this).parent().children().removeClass("active");
            updateSliderAndPrevPrices(minPrice, maxPrice);
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
            updateSliderAndPrevPrices(gPriceMin, gPriceMax);
        }
        removeInitialText();
    });
    $("body").on("change", "#minPrice, #maxPrice", function() {
        var numRegEx = /^[0-9]+$/,
            minPrice = $("#minPrice").val(),
            maxPrice = $("#maxPrice").val();
        if (numRegEx.test(minPrice) && numRegEx.test(maxPrice)) {
            minPrice = parseInt(minPrice, 10);
            maxPrice = parseInt(maxPrice, 10);
            if (minPrice < gPriceMin) {
                updateSliderAndPrevPrices(gPriceMin, maxPrice);
                return;
            }
            if (maxPrice > gPriceMax) {
                updateSliderAndPrevPrices(minPrice, gPriceMax);
                return;
            }
            if (minPrice <= maxPrice) {
                updateSliderAndPrevPrices(minPrice, maxPrice);
                return;
            }
        }
        updatePriceDisp(prevMinPrice, prevMaxPrice);
    });
    $("body").on("click", ".cleargroup", function() {
        var a = $(this).attr('groupname');
        if (a == "price") {
            updateSliderWithDisp(gPriceMin, gPriceMax);
        } else {
            $('.list_filter_val[groupname="' + a + '"].active').each(function() {
                $(this).click();
            });
        }
    });
    $("body").on("change", ".sortbymsplist", function() {
        var a = $(this),
            sortVal = a.val();
        querySortUrl = "&sort=" + sortVal;
        requestData();
    });

    if ($("#mobilefilterwrapper").length) {
        $.ajax({
            url: "/msp/prop_filters/mobile-new.html",
            success: function(response) {
                var data = response.split("//&//#");
                $("#mobilefilterwrapper").html(data[0]);
                $(".listitems_rd").html(data[1]);
                initFilterBoxPlugins();
                loadFilterBox();
            }
        });
    } else {
        initFilterBoxPlugins();
        loadFilterBox();
    }
});

function removeInitialText() {
    // Don't remove on filter refresh when initLoad is true
    if (initLoad === false)
        $(".list_header_text, .msplistdetails").remove();
}

function initFilterBoxPlugins(minSlider, maxSlider) {
    nanoScrollbarInit();
    $("#priceSlider").slider({
        range: true,
        min: 0,
        max: 200,
        values: [minSlider || 0, maxSlider || 200],
        step: 1,
        animate: true,
        slide: priceSliderCallback,
        stop: function(a, b) {
            slider2List(sliderVal2PriceVal(b.values[0]), sliderVal2PriceVal(b.values[1]));
        }
    });
}

function loadFilterBox() {
    requestStat = false;
    initHash = window.location.hash;
    if (!initHash) {
        isNoHash = true;
    } else {
        isNoHash = false;
        var k = initHash.split('&');
        $.each(k, function(d, e) {
            e += '';
            var f = e.replace('#', '');
            requestStat = true;
            if (f.indexOf('s=') === 0) {
                var g = f.split('=');
                searchTerm = g[1];
                addTag(searchTerm, searchTerm, 'searchTerm');
            } else if (f.indexOf("property") >= 0) {
                var h = f.split('=');
                var i = h[1].split('|');
                $.each(i, function(b, c) {
                    $('.list_filter_val').each(function(a) {
                        if ($(this).attr('value') == c) {
                            $(this).click();
                        }
                    });
                });
            } else if (f.indexOf("startinr") >= 0) {
                startInr = parseInt(f.split('=')[1],10);
            } else if (f.indexOf("endinr") >= 0) {
                endInr = parseInt(f.split('=')[1],10);
            } else if (f.indexOf("page") >= 0) {
                queryPageUrl = "&page=" + f.split('=')[1];
            } else if (f.indexOf("sort") >= 0) {
                var j = f.split('=')[1];
                querySortUrl = "&sort=" + j;
                $('.sortbymsplist option[value="' + j + '"]').attr('selected', 'selected');
            }  else {}
            var gp = $('#priceSlider').attr('value').split(';');
            gPriceMin = parseInt(gp[0], 10);
            gPriceMax = parseInt(gp[1], 10);
            if(!startInr || startInr < gPriceMin || isNaN(startInr)) startInr = gPriceMin;
            if(!endInr || endInr > gPriceMax || isNaN(endInr)) endInr = gPriceMax;
 
            if (startInr && endInr) {
                if (startInr == gPriceMin && endInr == gPriceMax)
                    queryPriceUrl = "";
                else
                    queryPriceUrl = "&startinr=" + startInr + "&endinr=" + endInr;
            }
        });
        requestStat = false;
        requestData();
    }

    var n = $('#priceSlider').attr('value').split(';');
    gPriceMin = prevMinPrice = parseInt(n[0], 10);
    gPriceMax = prevMaxPrice = parseInt(n[1], 10);
    if ($('#listheader').attr("start_price"))
        startInr = $('#listheader').attr("start_price");
    if ($('#listheader').attr("end_price"))
        endInr = $('#listheader').attr("end_price");
    if (endInr) {
        if (endInr > gPriceMax)
            endInr = gPriceMax;
        updateSliderWithDisp(parseInt(startInr, 10), parseInt(endInr, 10), true);
        //requestStat = false;
    }
    if (startInr && endInr) {
      if (startInr == gPriceMin && endInr == gPriceMax)
          queryPriceUrl = "";
      else
          queryPriceUrl = "&startinr=" + startInr + "&endinr=" + endInr;
    }

    if ($('#listheader').attr("brand")) {
        initLoad = true;
        var l = $('#listheader').attr("brand");
        if(l){
            $('.list_filter_val[groupname="brand"][dispname]').each(function(a) {
                if ($(this).attr('dispname').toLowerCase() === l.toLowerCase()) $(this).click();
            });
        }
    }
    if ($('#listheader').attr("property")) {
        initLoad = true;
        var m = $('#listheader').attr("property").split(/[\|\=]/);
        $('.list_filter_val').each(function(a) {
            var b = $(this).attr('value');
            if (m.indexOf(b) > -1) $(this).click();
        });
    }
    $(".list_filter").each(function() {
        if (!$(this).find('.filterSearchCont').length) return;
        var a = $(this).find(".list_filter_val"),
            filterItemLength = a.length;
        if (filterItemLength < 5) {
            a.closest(".list_filter").find(".filterSearchCont").hide();
        }
    });
}

function showHideReset() {
    $(".cleargroup:not([groupname='price'])").removeClass("show");
    $('.filter_name').removeClass('active');
    $('.list_filter_val.active').each(function() {
        $(".cleargroup[groupname='" + $(this).attr('groupname') + "']").addClass("show");
        $(this).closest('.list_filter').find('.filter_name').addClass('active');
    });
}

function deletePropTag(a) {
    $(".remfilter[value='" + a + "']").remove();
    queryPropertyUrl = queryPropertyUrl.replace("|" + a, '');
    requestData();
    if ($('.remfilter').length == $('.remfilter.all').length) {
        $('.remfilter.all').remove();
        $('.gridheader').removeClass('space');
    }
}

function removeTag(a) {
    if ($(a).hasClass('all')) {
        $(a).remove();
        $('.remfilter').each(function() {
            removeTag(this);
        });
    } else if ($(a).attr('groupname') == 'searchTerm') {
        $(a).remove();
        searchTerm = '';
        requestData();
    } else if ($(a).attr('groupname') == 'price') {
        $(a).remove();
        updateSliderAndPrevPrices(gPriceMin, gPriceMax);
    } else {
        var b = $(a).attr('value');
        $('.list_filter_val').filter('.active').filter('[value=' + b + ']').click();
    } if ($('.remfilter').length == $('.remfilter.all').length) {
        $('.remfilter.all').remove();
        $('.gridheader').removeClass('space');
    }
}

function addTag(a, b, c, h) {
    var d = "";
    if (c) {
        d = 'groupname="' + c + '"';
    }
    var e = '<div class="remfilter" ' + d + ' onclick="javascript:removeTag(this);" value="' + a + '"><img src="http://fashion.mysmartprice.com/images/search_clear.png" class="filterAppliedClear"> ' + b + '</div>';
    if ($('.gridheader').find('.remfilter').length === 0) {
        var f = '<div class="remfilter all"  onclick="javascript:removeTag(this);">CLEAR ALL</div>';
        $('.gridheader').append(f);
        $('.gridheader').addClass('space');
    }
    $('.gridheader').append(e);
    var g = window.location.hash;
    if (c != 'searchTerm' && c != 'price') queryPropertyUrl = (queryPropertyUrl || '') + "|" + a;
    if (!h) requestData();
}

function requestData() {
    if (requestStat === false) {
        var b = $('#msp_body').attr('category'),
            query = "subcategory=" + b;
        if (searchTerm) query += "&s=" + searchTerm;
        if (queryPropertyUrl) query += "&property=" + queryPropertyUrl;
        query += (queryPriceUrl || '') + (querySortUrl || '') + (queryPageUrl || '');
        if ($("#msp_body").length !== 0) {
            window.location.hash = query;
            if (xhrdata) xhrdata.abort();
            xhrdata = $.ajax({
                url: "/msp/processes/property/api/msp_get_html_for_property_new.php?" + query,
                success: function (response) {
                    var data = response.split("//&//#");
                    $(".filterbox").replaceWith(data[0]);
                    // On initial load, update only filters; ignore products (quick links will bypass this check)
                    if ((qS && qS.ql === "1") || initLoad === false) {
                        $(".listitems_rd").html(data[1]);
                        if (_gaq) _gaq.push(['_trackEvent', 'finder', 'query', query]);
                    }
                    initFilterBoxPlugins(priceVal2SliderVal($("#minPrice").val()), priceVal2SliderVal($("#maxPrice").val()));
                    initLoad = false;
                }
            });
        }
    }
}

function updateSliderAndPrevPrices(minPrice, maxPrice) {
    updateSliderWithDisp(minPrice, maxPrice);
    prevMinPrice = minPrice;
    prevMaxPrice = maxPrice;
}

function updateSliderWithDisp(a, b, c) {
    var d = priceVal2SliderVal(a),
        maxSlider = priceVal2SliderVal(b);
    $('#priceSlider').slider('values', [d, maxSlider]);
    updatePriceDisp(a, b);
    requestPriceData(a, b, c);
    slider2List(a, b, c);
}

function priceSliderCallback(a, b) {
    if ((b.values[0] + 1) >= b.values[1]) {
        return false;
    }
    var c = sliderVal2PriceVal(b.values[0]),
        maxPrice = sliderVal2PriceVal(b.values[1]);
    updatePriceDisp(c, maxPrice);
}

function priceVal2SliderVal(a) {
    for (var b = 0; b <= 200; b++) {
        if (a <= sliderVal2PriceVal(b)) return b;
    }
    return undefined;
}

function sliderVal2PriceVal(a) {
    var b = Math.exp(Math.log(gPriceMax / gPriceMin) / 200),
        priceValue = gPriceMin * Math.pow(b, a),
        roundOff = Math.pow(10, Math.floor(Math.log(priceValue - (priceValue / b)) / Math.log(10)));
    priceValue = Math.ceil(priceValue / roundOff) * roundOff;
    if (a === 0 || priceValue < gPriceMin) return gPriceMin;
    else if (a == 200 || priceValue > gPriceMax) return gPriceMax;
    else return priceValue;
}

function updatePriceDisp(a, b) {
    $("#minPrice").val(a);
    $("#maxPrice").val(b);
}

function requestPriceData(a, b, c) {
    if (a == gPriceMin && b == gPriceMax) {
        queryPriceUrl = "";
        $(".cleargroup[groupname='price']").removeClass("show");
        removeTag($('.remfilter[groupname="price"]')[0]);
    } else {
        $('.remfilter[groupname="price"]').remove();
        addTag(a + ';' + b, a.toLocaleString() + '-' + b.toLocaleString(), 'price', c);
        queryPriceUrl = "&startinr=" + a + "&endinr=" + b;
        $(".cleargroup[groupname='price']").addClass("show");
    }
    if (!c) requestData();
}

function slider2List(a, b, c) {
    requestPriceData(a, b, c);
    $('.list_filter_val.price_val').removeClass('active');
    $('.list_filter_val.price_val').each(function() {
        if ($(this).attr('value') == a + ";" + b) {
            $(this).addClass('active');
        }
    });
}

function nanoScrollbarInit() {
    $('.filterbox .nano').each(function() {
        $filteritem = $('.list_filter_val', $(this));
        if ($filteritem.length < 5) {
            var a = 0;
            $filteritem.each(function() {
                a += $(this).outerHeight();
            });
            if (a < 140) $(this).parent('.filter_val_box_scroll').css('height', a + 'px');
        }
    });
    $('.nano').nanoScroller({
        alwaysVisible: true
    });
}