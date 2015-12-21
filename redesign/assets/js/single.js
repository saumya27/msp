/*! TinySort 1.5.6
 * * Copyright (c) 2008-2013 Ron Valstar http://tinysort.sjeiti.com/
 * * License:
 * *     MIT: http://www.opensource.org/licenses/mit-license.php
 * *     GPL: http://www.gnu.org/licenses/gpl.html
 * */
!function(a,b){"use strict";function c(a){return a&&a.toLowerCase?a.toLowerCase():a}function d(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]==b)return!e;return e}var e=!1,f=null,g=parseFloat,h=Math.min,i=/(-?\d+\.?\d*)$/g,j=/(\d+\.?\d*)$/g,k=[],l=[],m=function(a){return"string"==typeof a},n=function(a,b){for(var c,d=a.length,e=d;e--;)c=d-e-1,b(a[c],c)},o=Array.prototype.indexOf||function(a){var b=this.length,c=Number(arguments[1])||0;for(c=0>c?Math.ceil(c):Math.floor(c),0>c&&(c+=b);b>c;c++)if(c in this&&this[c]===a)return c;return-1};a.tinysort={id:"TinySort",version:"1.5.6",copyright:"Copyright (c) 2008-2013 Ron Valstar",uri:"http://tinysort.sjeiti.com/",licensed:{MIT:"http://www.opensource.org/licenses/mit-license.php",GPL:"http://www.gnu.org/licenses/gpl.html"},plugin:function(){var a=function(a,b){k.push(a),l.push(b)};return a.indexOf=o,a}(),defaults:{order:"asc",attr:f,data:f,useVal:e,place:"start",returns:e,cases:e,forceStrings:e,ignoreDashes:e,sortFunction:f}},a.fn.extend({tinysort:function(){var p,q,r,s,t=this,u=[],v=[],w=[],x=[],y=0,z=[],A=[],B=function(a){n(k,function(b){b.call(b,a)})},C=function(a,b){return"string"==typeof b&&(a.cases||(b=c(b)),b=b.replace(/^\s*(.*?)\s*$/i,"$1")),b},D=function(a,b){var c=0;for(0!==y&&(y=0);0===c&&s>y;){var d=x[y],f=d.oSettings,h=f.ignoreDashes?j:i;if(B(f),f.sortFunction)c=f.sortFunction(a,b);else if("rand"==f.order)c=Math.random()<.5?1:-1;else{var k=e,o=C(f,a.s[y]),p=C(f,b.s[y]);if(!f.forceStrings){var q=m(o)?o&&o.match(h):e,r=m(p)?p&&p.match(h):e;if(q&&r){var t=o.substr(0,o.length-q[0].length),u=p.substr(0,p.length-r[0].length);t==u&&(k=!e,o=g(q[0]),p=g(r[0]))}}c=d.iAsc*(p>o?-1:o>p?1:0)}n(l,function(a){c=a.call(a,k,o,p,c)}),0===c&&y++}return c};for(p=0,r=arguments.length;r>p;p++){var E=arguments[p];m(E)?z.push(E)-1>A.length&&(A.length=z.length-1):A.push(E)>z.length&&(z.length=A.length)}for(z.length>A.length&&(A.length=z.length),s=z.length,0===s&&(s=z.length=1,A.push({})),p=0,r=s;r>p;p++){var F=z[p],G=a.extend({},a.tinysort.defaults,A[p]),H=!(!F||""===F),I=H&&":"===F[0];x.push({sFind:F,oSettings:G,bFind:H,bAttr:!(G.attr===f||""===G.attr),bData:G.data!==f,bFilter:I,$Filter:I?t.filter(F):t,fnSort:G.sortFunction,iAsc:"asc"==G.order?1:-1})}return t.each(function(c,d){var e,f=a(d),g=f.parent().get(0),h=[];for(q=0;s>q;q++){var i=x[q],j=i.bFind?i.bFilter?i.$Filter.filter(d):f.find(i.sFind):f;h.push(i.bData?j.data(i.oSettings.data):i.bAttr?j.attr(i.oSettings.attr):i.oSettings.useVal?j.val():j.text()),e===b&&(e=j)}var k=o.call(w,g);0>k&&(k=w.push(g)-1,v[k]={s:[],n:[]}),e.length>0?v[k].s.push({s:h,e:f,n:c}):v[k].n.push({e:f,n:c})}),n(v,function(a){a.s.sort(D)}),n(v,function(a){var b=a.s,c=a.n,f=b.length,g=c.length,i=f+g,j=[],k=i,l=[0,0];switch(G.place){case"first":n(b,function(a){k=h(k,a.n)});break;case"org":n(b,function(a){j.push(a.n)});break;case"end":k=g;break;default:k=0}for(p=0;i>p;p++){var m=d(j,p)?!e:p>=k&&k+f>p,o=m?0:1,q=(m?b:c)[l[o]].e;q.parent().append(q),(m||!G.returns)&&u.push(q.get(0)),l[o]++}}),t.length=0,Array.prototype.push.apply(t,u),t}}),a.fn.TinySort=a.fn.Tinysort=a.fn.tsort=a.fn.tinysort}(jQuery);
/*! TinySort 1.5.6 -- end */

var PriceTable = {
    "dataPoints" : {
        "category" : $(".body-wrpr").attr("category"),
        "mspid" : $(".prdct-dtl__ttl").data("mspid"),
        "defaultRows" : $(".prc-tbl-row:visible").length,
        "variant" : {
            "model" : $(".prdct-dtl__ttl-vrnt").data("model"),
            "size" : $(".prdct-dtl__ttl-vrnt").data("size")
        },
        "partialOnlineRows" : true,
        "price" : {
            "getMrp" : function() { return $(".prdct-dtl__slr-prc-mrp-prc").data("value") },
        },
        "productThumb" : $(".prdct-dtl__thmbnl-img").eq(0).attr("src"),
        "getTitle" : function(){ return $(".prdct-dtl__ttl").text(); },
        "getSelectedColor" : function() { return $(".avlbl-clrs__inpt:checked").val() },
        "getAppliedSort" : function() { return $(".js-prc-tbl__sort").val(); },
        "getAppliedFilters" : function() {
            return $.map($(".prc-tbl__fltrs-inpt:checked"), function(node) {
                return $(node).attr("value");
            });
        },
        "getSelectedCategory" : function() {
            return $(".prc-tbl__ctgry-inpt:checked").val();
        },
        "getSelectedCategoryLabel" : function() {
            return $(".prc-tbl__ctgry-inpt:checked").data("label");
        }
    },
    "init" : function() {
        var $pageTitle = $(".prdct-dtl__ttl");
    
        // select color and updatePage.
        $doc.on("click", ".avlbl-clrs__inpt", (function() {
            var prevValue = PriceTable.dataPoints.getSelectedColor();
            return function() {
                var $this = $(this),
                    $variant = $(".prdct-dtl__ttl-vrnt"),
                    $clearColor = $this.closest(".prdct-dtl__vrnt-clr").find(".prdct-dtl__vrnt-cler"),
                    model = $variant.data("model"),
                    size = $variant.data("size"),
                    colorValue = $this.val();
                    
                if (colorValue === prevValue) {
                    $variant.text("(" + (model ? model + ", " : "") + colorValue + (size ? ", " + size : "") + ")");
                    
                    $clearColor.hide();
                    $this.prop("checked", false);
                } else {
                    $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
                    
                    $clearColor.show();
                }
                
                PriceTable.update.byFilter(undefined, {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
            }
        })());

        // clear selected color and updatePage.
        $doc.on("click", ".prdct-dtl__vrnt-clr .prdct-dtl__vrnt-cler", function() {
            var $variant = $(".prdct-dtl__ttl-vrnt"),
                model = PriceTable.dataPoints.variant.model,
                size = PriceTable.dataPoints.variant.size;
            
            $(".avlbl-clrs__inpt").prop("checked", false);
            $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
            $(this).hide();
            PriceTable.update.byFilter(undefined, {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
        });

        // load the variant page selected.
        $doc.on("click", ".avlbl-sizes__item", function() {
            var $this = $(this);
            if (!$this.hasClass("avlbl-sizes__item--slctd")) {
                window.location.href = $this.data("href");
            }
        });

        // switch between recommended, online, offline pricetables.
        $doc.on("click", ".js-ctgry-inpt", (function() {
            var previousValue = "recommended";
            return function() {
                var $this = $(this),
                    currentValue = $this.attr("value"),
                    isSelected = currentValue === previousValue;
                    
                if (!isSelected) {
                    $(".js-ctgry-inpt").prop("checked", false);
                    $this.prop("checked", true);
                    
                    previousValue = currentValue;
                    PriceTable.update.byFilter(currentValue, {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
                }
            }
        })());

        // online and offline stores - user choice
        $doc.on('click', '.js-offln-click', function () {
            $('.js-ctgry-inpt[value="offline"]').trigger('click');
        });
        $doc.on('click', '.js-onln-click', function () {
            $('.js-ctgry-inpt[value="online"]').trigger('click');
        });

        // apply filters to current pricetable.
        $doc.on("click", ".prc-tbl__fltrs-inpt", function() {
            PriceTable.update.byFilter(undefined, {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
        });
        
        // sort current pricetable.
        ;(function pricetableSortingHandlers() {
            $doc.on("change", ".js-prc-tbl__sort", function() {
                var newSortby = $(this).val(),
                    category = newSortby.split(":")[0],
                    $updatedColumn = $(".prc-tbl-hdr__clm[data-sort-category='" + category + "']");

                // fetch fresh data if all stores are not loaded
                if(PriceTable.dataPoints.partialOnlineRows) {
                    PriceTable.update.byFilter(undefined, {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
                    return;
                }

                updatePriceTableColumns($updatedColumn, newSortby);
            
                PriceTable.sort(newSortby);
            });

            $doc.on("click", ".prc-tbl-hdr__clm[data-sort-value]", function() {
                var newSortby = $(this).data("sort-value");

                // change sort dropdown value to trigger pricetable update accordingly.
                $(".js-prc-tbl__sort").val(newSortby).change();
            });

            function updatePriceTableColumns($updatedColumn, newSortby) {
                var newSortby, nextSortby, category, newOrder, oldOrder, nextOrder;

                if ($updatedColumn.length) {
                    // get category and new order to be applied.
                    category = newSortby.split(":")[0];
                    newOrder = newSortby.split(":")[1];

                    /**
                     * MSP.utils.rotateValue => rotate values in a set,
                     * used here to toggle between two values.
                     */
                    oldOrder = nextOrder = MSP.utils.cycleShift(["asc", "desc"], newOrder);
                    nextSortby = category + ":" + nextOrder;

                    // assign new sort value and class to the column
                    $updatedColumn.data("sort-value", nextSortby);
                    $updatedColumn.find(".prc-tbl-hdr__arw").removeClass("prc-tbl-hdr__arw--" + oldOrder).addClass("prc-tbl-hdr__arw--" + newOrder);
                    // reset all columns label to unsorted and apply sorting to current column.
                    $(".prc-tbl-hdr__clm[data-sort-category]").removeClass("prc-tbl-hdr__clm--slctd").find(".prc-tbl-hdr__cptn").text("Sort By");
                    $updatedColumn.addClass("prc-tbl-hdr__clm--slctd").find(".prc-tbl-hdr__cptn").text("Sorted By");
                } else {
                    // reset all columns to unsorted
                    $(".prc-tbl-hdr__clm[data-sort-category]").removeClass("prc-tbl-hdr__clm--slctd").find(".prc-tbl-hdr__cptn").text("Sort By");
                }
            }
        }());

        // show more stores.
        $doc.on('click', '.js-prc-tbl__show-more', function() {
            var $this = $(this),
                $priceLines = $(".prc-tbl-row"),
                isCollapsed = $this.data("collapsed"),
                defaultRows = PriceTable.dataPoints.defaultRows,
                allRows = $('.prc-tbl-row').length,
                _loadingMaskHTML = PriceTable.components.loadingMask(),
                _innerPriceTable = $('.prc-tbl-inr');
            $this.html(_loadingMaskHTML).removeClass('js-prc-tbl__show-more');

            // Check if more than 6 stores are visible:
            if(isCollapsed && !($('.js-offln-avl').length) && !(allRows - defaultRows)) {
                PriceTable.update.byFilter('online', {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
                PriceTable.dataPoints.partialOnlineRows = false;
            }

            $priceLines.slice(defaultRows).slideToggle();
            if (isCollapsed) {
                $this.text("Less Stores");
                $("body").animate({
                    scrollTop: $priceLines.eq(defaultRows - 1).offset().top - $(".hdr-size").height()
                });
                $this.data("collapsed", false);
            } else {
                $this.text("Show More Stores");
                $("body").animate({
                    scrollTop: $priceLines.eq(defaultRows).offset().top - $(window).height() + $(".hdr-size").height()
                });
                $this.data("collapsed", true);
            }

            $this.addClass('js-prc-tbl__show-more');
        });

        /* more offers message box handlers - start */
        $doc.on("click", ".js-xtrs-msg-box-trgt", function handler(e) {
            var $popupCont = $(this),
                $popup = $popupCont.find(".prc-tbl__xtrs-clm-pop"),
                $row = $(this).closest(".prc-tbl-row"),
                mspid, currentColour, storename, offerDetails, offersMsgBoxHtml;

            if (!$(e.target).hasClass("js-xtrs-msg-box__cls")) {
                handler.popupData = handler.popupData || {};
                if (!$popup.hasClass("msg-box--show")) {
                    mspid = PriceTable.dataPoints.mspid;
                    storename = $row.data("storename");
                    currentColour = PriceTable.dataPoints.getSelectedColor() || "default";
                    
                    if (handler.popupData.colour !== currentColour) {
                        PriceTable.fetch.offersPopups().done(function(response) {
                            handler.popupData.content = response;
                            offerDetails = response[storename];
                        
                            offersMsgBoxHtml = PriceTable.components.offersMsgBox(offerDetails);
                            $popupCont.append(offersMsgBoxHtml);
                            var reflow = $("body").offset().top;
                            $popupCont.find(".msg-box").addClass("msg-box--show");
                        });
                    } else {
                        offerDetails = handler.popupData.content[storename];
                        offersMsgBoxHtml = PriceTable.components.offersMsgBox(offerDetails);
                        
                        $popupCont.append(offersMsgBoxHtml);
                        $popupCont.find(".msg-box").addClass("msg-box--show");
                    }
                }
            }
        });

        $doc.on("click", ".js-xtrs-msg-box__cls", function() {
            $(this).closest(".msg-box").remove();
        });

        // close all message boxes on pressing escape key
        $('body').keydown(function(e) {
            if (e.which == 27 && $('.msg-box').is(':visible')) {
                $('.js-msg-box__cls, .js-xtrs-msg-box__cls').click();
            }
        });
        /* more offers message box handlers - end */

        ;(function locationFilterHandlers() {
            var isChrome = MSP.utils.browser.name === "chrome",
                isLocationStored;

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
                $doc.on("click", ".prc-tbl__lctn-gps, .prc-tbl__gps-btn", function() {
                    isLocationStored = ("userLatitude" in window.localStorage);

                    /**
                     * if chrome and location not available in localStorage,
                     * then open overlay to focus permission popup
                     */
                    if (isChrome && !isLocationStored) {
                        $(".js-glctn-ovrly").addClass("js-ovrly--show");
                        $("body").css("overflow", "hidden");
                    }

                    navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);

                    function locationSuccess(position) {
                        var latitude = position.coords.latitude,
                            longitude = position.coords.longitude;

                        /**
                         * 1. update localStorage values for fallback when permission denied.
                         * 2. for chrome - localstorage value is indicator that location permission is available 
                         */
                        if (window.localStorage) {
                            window.localStorage.userLatitude = latitude;
                            window.localStorage.userLongitude = longitude;
                        }

                        // for non-chrome browsers - session storage value -> indicating that location permission available.
                        if (!isChrome && window.sessionStorage) {
                            window.sessionStorage.userLatitude = latitude;
                            window.sessionStorage.userLongitude = longitude;
                        }

                        // set location input field value to notify user. 
                        $(".prc-tbl__lctn-inpt").val("Your current location");
                      
                        // remove geolocation overlay if present
                        //$(".js-glctn-ovrly").click();
                        $(".js-glctn-ovrly").removeClass("js-ovrly--show");
                        $("body").css("overflow", "auto");
                      
                        // switch tab to offline.
                        $(".prc-tbl__ctgry-inpt").prop("checked", false);
                        $(".prc-tbl__ctgry-inpt[value='offline']").prop("checked", true);

                        PriceTable.update.byFilter('offline', {
                            "latitude" : latitude,
                            "longitude" : longitude
                        });

                        if (_gaq) _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'allow']);
                    }

                    function locationFail() {
                        // remove geolocation overlay if present
                        $(".js-glctn-ovrly").click();

                        // if previous location value available in localStorage, then use it and update priceTable
                        if (isLocationStored) {
                            PriceTable.update.byFilter(PriceTable.dataPoints.getSelectedCategory(), {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
                        }

                        if (_gaq)_gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'deny']);
                    }
                });

                // clicking on chrome geolocation overlay should remove it.
                $doc.on("click", ".js-glctn-ovrly", function () {
                    $(".js-glctn-ovrly").removeClass("js-ovrly--show");
                    $("body").css("overflow", "auto");
                });

                // bind Google maps autocomplete to location searchbox.
                ;(function initAutocomplete() {
                    var autocomplete = new google.maps.places.Autocomplete($(".prc-tbl__lctn-inpt").get(0), {
                        componentRestrictions: { country: "in" },
                        types: ["geocode"]
                    });
                    google.maps.event.addListener(autocomplete, "place_changed", function() {
                        var place = autocomplete.getPlace(),
                            location = place && place.geometry && place.geometry.location;
                        if (location) {
                            // if online stores is selected switch tab to offline.
                            if (PriceTable.dataPoints.getSelectedCategory() === "online") {
                                $(".prc-tbl__ctgry-inpt").prop("checked", false);
                                $(".prc-tbl__ctgry-inpt[value='offline']").prop("checked", true);
                            }
                            
                            PriceTable.update.byFilter(PriceTable.dataPoints.getSelectedCategory(), {
                                "latitude" : location.lat(),
                                "longitude" : location.lng()
                            });
                        }
                    });
                }());
            } else {
                _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'not_supported']);
            }
        }());

    // Addition : To fetch all stores and check if offline stores is available
        ;(function fetchStoresForOfflineInfo() {

            PriceTable.fetch.tableByFilter( 
                    "recommended",  // store type
                    'popularity:desc', // initial sorting
                    PriceTable.dataPoints.getAppliedFilters(), // applied filters (none initially)
                    {                   // location object
                        "latitude" : window.localStorage.userLatitude,
                        "longitude" : window.localStorage.userLongitude
                    }
            ).done(function (json) {
                if(json.offline_store_count) {
                    PriceTable.update.byFilter(
                        "recommended", 
                        {                   // location object
                            "latitude" : window.localStorage.userLatitude,
                            "longitude" : window.localStorage.userLongitude
                        }
                    );
                }
            });

        }());
    // END
    },
    "update" : {
        // "byCategory":function(type,location){var_loadingMaskHTML=PriceTable.components.loadingMask(),_innerPriceTable=$('.prc-tbl-inr');_innerPriceTable.append(_loadingMaskHTML);PriceTable.fetch.tableByCategory(type,location).done(function(html{varcategoryLabel=PriceTable.dataPoints.getSelectedCategoryLabel();$(".prdct-dtl__slr-prc-tbl-btn").data("action","enabled");_innerPriceTable.html(html);$(".prc-tbl-hdr__strs.prc-tbl-hdr__cptn").text(categoryLabel);}).fail(function(){innerPriceTable.find('.js-fltr-ldng-mask').remove();});},
        
        "byFilter" : function(storetype, location) {            // pass storetype as 'undefined' for all data
            var _loadingMaskHTML = PriceTable.components.loadingMask(),
                _innerPriceTable = $('.prc-tbl-inr'),
                $showMoreStores = $(".js-prc-tbl__show-more"),
                _sort = $('.sort-wrpr__ctgry-inpt:checked').attr('value'),
                _type = storetype || $('.js-ctgry-inpt:checked').attr('value'),
                _appliedFilters = PriceTable.dataPoints.getAppliedFilters(),
                _colour = PriceTable.dataPoints.getSelectedColor();

            _innerPriceTable.append(_loadingMaskHTML);

            PriceTable.fetch.tableByFilter(_type, _sort, _appliedFilters, location, _colour).done(function (json) {
                if (json) {

                    if (json.lowest_price) {
                        $(".prdct-dtl__slr-prc-rcmnd-val").html(json.bestprice);
                    }
                    // if (json.discount) { $(".prdct-dtl__slr-prc-mrp-dscnt").text("[" + json.discount + "% OFF]"); } if (json.mspCoins) { $(".prdct-dtl__slr-ftrs-lylty-val").text(json.mspCoins); } if (json.buybutton) { $(".prdct-dtl__slr-prc-btn").replaceWith(json.buybutton); }
                    if (json.pricetable) {
                        _innerPriceTable.html(json.pricetable);
                        if ($(".prc-tbl-row").length > PriceTable.dataPoints.defaultRows) {
                            $(".prc-tbl-row").slice(PriceTable.dataPoints.defaultRows).hide();
                            $showMoreStores.show().data("collapsed", true).text("Show More Stores");
                        } else {
                            $showMoreStores.hide();
                        }
                    }

                    if(json.offline_store_count) {
                        // _innerPriceTable.html(json.pricetable);
                        PriceTable.dataPoints.partialOnlineRows = false;

                        $('.prc-tbl__ctrls').css('display', 'block');
                        $('.prc-tbl-hdr').css('border-top', '1px solid #dfe1e8');

                        $('.js-strs-offln-prc').html(json.offline_best_price);

                        // TODO:: get no. of offline and online stores
                        $('.js-strs-offln-cnt').html('View ' + json.offline_store_count + ' Nearby Stores &#187;');
                        $('.prdct-dtl__slr').addClass('js-offln-avl');
                        if(!json.onlineprice) {
                            $('.prdct-dtl__slr').removeClass('js-offln-avl').addClass('js-only-offln-avl');
                        } 
                    }
                }
            }).fail(function() {
                _innerPriceTable.find('.js-fltr-ldng-mask').remove();
            });
        }
    },
    "sort" : function(sortby) {
        var $priceTableContainer = $('.prc-tbl-inr'),
            $priceTableRows = $('.prc-tbl-row'),
            sortColumn = sortby.split(":")[0],
            sortOrder = sortby.split(":")[1],
            sortTypes;

        // close all messageBoxes before sorting priceTable
        $('.js-msg-box__cls, .js-xtrs-msg-box__cls').click();

        sortTypes = {
            "popularity" : { "attr" : "data-relrank" },
            "price" : { "attr" : "data-pricerank" },
            "price" : { "attr" : "data-pricerank" },
            "rating" : { "attr" : "data-rating" },
            "rating" : { "attr" : "data-rating" }
        };

        $priceTableContainer.css({
            height: $priceTableContainer.height(),
            display: 'block'
        });

        $priceTableRows.show();
        $priceTableRows.each(function(i, el) {
            var iY = $(el).position().top;
            $.data(el, 'h', iY);
        });

        if (_gaq) _gaq.push(['_trackEvent', 'sort_by', sortby, '']);

        if (sortby === 'popularity:desc') {
            $('.prc-tbl-row--NA').attr("data-relrank", "9999");
        } else if (sortby === 'price:asc') {
            $('.prc-tbl-row--NA').attr("data-pricerank", "9999999");
        } else if (sortby === 'price:desc') {
            $('.prc-tbl-row--NA').attr("data-pricerank", "0");
        } else if (sortby === 'rating:asc') {
            $('.prc-tbl-row--NA').attr("data-rating", "6");
            $('.prc-tbl-row--NA').find('.js-prc-tbl__str-rtng').attr("data-rating", "6");
        } else if (sortby === 'rating:desc') {
            $('.prc-tbl-row--NA').attr("data-rating", "-1");
            $('.prc-tbl-row--NA').find('.js-prc-tbl__str-rtng').attr("data-rating", "-1");
        }

        $('.prc-tbl-row').tsort({
            "attr" : sortTypes[sortColumn].attr,
            "order" : sortOrder
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.prc-tbl-row:visible').each(function() {
                iTo += $(this).outerHeight();
            });
            $El.css({
                position: 'absolute',
                top: iFr
            }).stop().animate({
                top: iTo
            }, 500, function() {
                $priceTableRows.css({
                    position: 'relative',
                    top: 'auto'
                });
                $priceTableContainer.css({
                    height: 'auto',
                    display: 'block'
                });
                
                if ($(".js-prc-tbl__show-more").data("collapsed")) {
                    $priceTableRows.slice(PriceTable.dataPoints.defaultRows).hide();
                } else {
                    $priceTableRows.slice(PriceTable.dataPoints.defaultRows).show();
                }
            });
        });
    },
    "components" : {
        "loadingMask" : function () {
                return [
                    '<div class="js-fltr-ldng-mask">',
                        '<div class="ldr">',
                            '<div class="ldr__crcl"></div>',
                            '<div class="ldr__text" style="">Loading...</div> ',
                        '</div>',
                    '</div>'
                ].join("");
        },
        "offersMsgBox" : function(offerDetails) {
            var offerCount, offerRows, msgBoxHtml;

            offerCount = $(offerDetails).find("li").length || 1,
            offerRows = (function() {
                var result = "";
                if (offerCount) {
                    $(offerDetails).find("li").each(function() {
                        result += '<div class="msg-box__row">' + $(this).html() + '</div>';
                    });
                } else {
                    result += '<div class="msg-box__row">' + $(offerDetails).html() + '</div>';
                }
                return result;
            }());

            msgBoxHtml = [
                '<div class="msg-box prc-tbl__xtrs-clm-pop">',
                    '<div class="msg-box__hdr clearfix">',
                        offerCount + ' Offers',
                        '<span class="msg-box__cls js-xtrs-msg-box__cls">×</span>',
                    '</div>',
                    '<div class="msg-box__inr">',
                        offerRows,
                    '</div>',
                '</div>',
            ].join("");

            return msgBoxHtml;
        }
    },
    "fetch" : {
        // "tableByCategory":MSP.utils.memoize(function_productList(type,location{return$.ajax({"url":"/mobile/offline/delivery_pricetable.php","data":{"mspid":PriceTable.dataPoints.mspid,"mrp":PriceTable.dataPoints.price.getMrp(),"type":type,"latitude":location&&location.latitude,"longitude":location&&location.longitude}});},{cacheLimit:10}),
        "tableByFilter" : MSP.utils.memoize(function(type, sort, appliedFilters, location, selectedColor) { 
            var dfd = $.Deferred(),
                query = {
                    "mspid": PriceTable.dataPoints.mspid,
                    "mrp": PriceTable.dataPoints.price.getMrp() || 0,
                    "sort": PriceTable.dataPoints.getAppliedSort(),
                    "colour": (PriceTable.dataPoints.getSelectedColor() || "").toLowerCase(),
                    "cod": appliedFilters.indexOf("cod") !== -1,
                    "emi": appliedFilters.indexOf("emi") !== -1,
                    "returnpolicy": appliedFilters.indexOf("returnPolicy") !== -1,
                    "offers": appliedFilters.indexOf("offers") !== -1,
                    "coupons": appliedFilters.indexOf("coupons") !== -1,
                    "storetype": type || "recommended",
                    "sort": sort || "popularity:desc",
                    "latitude" : location && location.latitude,
                    "longitude" : location && location.longitude,
                    "colour": selectedColor || false
                };

            $.ajax({
                "url": "/mobile/filter_response_new.php",
                "dataType": "json",
                "data": query
            }).done(function (response) {
                dfd.resolve(response);
            }).fail(function (response) {
                dfd.reject(response);
            });

            return dfd.promise();
        }, {
            cacheLimit : 10
        }),
        "offersPopups" : MSP.utils.memoize(function(mspid, color) {
            var dfd = $.Deferred(),
                currentColour = PriceTable.dataPoints.getSelectedColor();
            $.ajax({
                "url" : "assets/js/offers.json",
                "type" : "GET",
                "dataType" : "json",
                "data" : {
                    "mspid" : mspid,
                    "color" : (currentColour !== "default") ? currentColour : undefined
                }
            }).done(function(response) {
                dfd.resolve(response);
            });
            return dfd.promise();
        }, {
            cacheLimit : 10
        })
    }
};


$(document).ready(function() {

    PriceTable.init();

/* additions */

    // display online/offline store based on availability
    if($('.js-offln-avl').length) { // both offline and online are available
        $('.prdct-dtl__slr-strs').removeClass('prdct-dtl__slr-strs--l');
    } else if($('.js-only-offln-avl').length) { // only offline is available
        $('.prdct-dtl__slr-strs-ntfy, .prdct-dtl__slr-onln').remove();
    }

    // To Notify user when product becomes available
    // Includes both cases - "Coming soon" as well as "Out of Stock"
    $doc.on('submit', '.js-ntfy-frm', function() {
        var $inputField = $(this).find(".js-ntfy-eml"),
            $erroNode = $(this).find(".js-ntfy-err");
        MSP.utils.validate.form([{
            "type" : "email",
            "inputField" : $inputField,
            "errorNode" : $erroNode
        }]).done(function() {
            // TODO
            // $.ajax({
            //     "url" : "out_of_stock_api_url",
            //     "data" : {
            //         "email" : emailValue
            //     }
            // });
            // hide form & show success message.
            $(".js-ntfy-eml").hide();
            $(".js-ntfy-sbmt").hide();
            $(".js-ntfy-sccss").fadeIn();
        });
        return false;
    });

/* End of additions */

    // save to list button handlers - start 
    $doc.on('click', ".prdct-dtl__save", function(e) {
        loginCallback(function() {
            $(".prdct-dtl__save").addClass("prdct-dtl__save--svd");
            $.get("/users/add_to_list.php", {
                mspid: PriceTable.dataPoints.mspid
            }, function(data) {});
        });
        return false;
    });

    $doc.on("click", ".js-user-lgt", function(e) {
        $(".prdct-dtl__save").removeClass("prdct-dtl__save--svd");
    });
    // save to list button handlers - end
    
    // Multiple Image Show on Top Section - Start
    $(".prdct-dtl__thmbnl").on("mouseenter", function(e) {
        var newSrc = $(this).find(".prdct-dtl__thmbnl-img").attr("src");

        //Destination Image
        $(".prdct-dtl__img").attr("src", newSrc);
        $(".prdct-dtl__img").attr("data-thumb-id", thumbId);
        $(".prdct-dtl__img-wrpr").attr("data-href", $(this).data("href"));

        $(".prdct-dtl__thmbnl").removeClass("prdct-dtl__thmbnl--slctd");
        $(this).addClass("prdct-dtl__thmbnl--slctd");
    });
    $(".prdct-dtl__thmbnl-wrpr").on("mouseleave", function(e) {
        var newSrc = $(".prdct-dtl__img").data("image");
        $(".prdct-dtl__img").attr("src", newSrc);
    });
    $(".prdct-dtl__img-wrpr, .prdct-dtl__thmbnl").on("click", function(e){
        var query = [
        'mspid=' + $(".prdct-dtl__ttl").data("mspid"),
        'primaryThumb=' + $(".prdct-dtl__img").data("image"),
        'maxThumbs=' + ($(".prdct-dtl__thmbnl-wrpr .prdct-dtl__thmbnl").length + 1),
        'thumbId=' + $(".prdct-dtl__img").data("thumb-id")
        ].join("&");
        openPopup("/mobile/multiple_images_popup.php?" + query);
    });
    // Multiple Image Show on Top Section - End

    $(".prdct-dtl__no-stck-form").on("submit", function() {
        var $inputField = $(this).find(".prdct-dtl__no-stck-inpt"),
            $erroNode = $(this).find(".js-vldtn-err");
        MSP.utils.validate.form([{
            "type" : "email",
            "inputField" : $inputField,
            "errorNode" : $erroNode
        }]).done(function() {
            // TODO:: 
            // $.ajax({
            //     "url" : "out_of_stock_api_url",
            //     "data" : {
            //         "email" : emailValue
            //     }
            // });
            // hide form & show success message.
            $(".prdct-dtl__no-stck-form").hide();
            $(".prdct-dtl__no-stck-scs").fadeIn();
        });
        return false;
    });

    // if GTS is not a popup target then open storeUrl in new tab.
    $doc.on("click", ".js-prc-tbl__gts-btn", function() {
        var storeUrl = $(this).data("url"),
            hasPopup = $(this).hasClass("js-popup-trgt") || $(this).hasClass("js-lylty-popup-trgt"),
            isEnabled = !$(this).hasClass("btn-GTS--dsbld");
        if (!hasPopup && isEnabled) {
            window.open(storeUrl);
        }
    });

    $(".prc-tbl__no-stck-form").on("submit", function() {
        var $inputField = $(this).find(".prc-tbl__no-stck-inpt"),
            $erroNode = $(this).find(".js-vldtn-err");
        MSP.utils.validate.form([{
            "type" : "email",
            "inputField" : $inputField,
            "errorNode" : $erroNode
        }]).done(function() {
            // TODO::
            // $.ajax({
            //     "url" : "out_of_stock_api_url",
            //     "data" : {
            //         "email" : emailValue
            //     }
            // });
            $(".prc-tbl__no-stck-form").hide();
            $(".prc-tbl__no-stck-scs").fadeIn();
        });
        return false;
    });

    $(".prdct-dtl__no-stck-form").on("submit", function() {
        var $inputField = $(this).find(".prdct-dtl__no-stck-inpt"),
            $erroNode = $(this).find(".js-vldtn-err");
        MSP.utils.validate.form([{
            "type" : "email",
            "inputField" : $inputField,
            "errorNode" : $erroNode
        }]).done(function() {
            // TODO::
            // $.ajax({
            //     "url" : "out_of_stock_api_url",
            //     "data" : {
            //         "email" : emailValue
            //     }
            // });
            // hide form & show success message.
            $(".prdct-dtl__no-stck-form").hide();
            $(".prdct-dtl__no-stck-scs").fadeIn();
        });
        return false;
    });
    
    // show more techspecs.
    if ($(".prdct-dtl__spfctn-more-wrpr").length) {
        $doc.on("click", ".js-prdct-dtl__spfctn-show-more, .js-prdct-dtl__spfctn-show-less", function() {
            var delay = $(this).hasClass("js-prdct-dtl__spfctn-show-less") ? 400 : 0;
            setTimeout(function() {
                $(".js-prdct-dtl__spfctn-show-more").toggle();
            }, delay);
            $(".prdct-dtl__spfctn-more-wrpr").toggleClass("prdct-dtl__spfctn-more-wrpr--show");
        });
    }

    //Show video on click of thumbnail - Start
    $(".exprt-rvw__vid-play").on("click", function(e) {
        var $playNode = $(this);
            $imageNode = $playNode.siblings(".exprt-rvw__vid-img"),
            $container = $playNode.parent(),
            height = $container.height(),
            width = $container.width(),
            videoId = $imageNode.data("video-id");

        $imageNode.remove();
        $playNode.remove();
        $container.append('<iframe class="exprt-rvw__vid-iframe" width="'+width+'" height="'+height+'" src="//www.youtube.com/embed/'+videoId+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    });
    //Show video on click of thumbnail - End

    $doc.on("click", ".js-usr-rvw__hlpfl, .js-usr-rvw__no-hlpfl", (function() {
        // private voteReview function that is declared on load.
        function voteReview(voteButton) {
            var reviewId = voteButton.closest(".usr-rvw-item").data("review-id"),
                mspid = PriceTable.dataPoints.mspid,
                vote = voteButton.hasClass("js-usr-rvw__hlpfl") ? 1 : -1;
            $.post("/msp/review/post_vote.php", {
                reviewid: reviewId,
                mspid: mspid,
                vote: vote
            });

            voteButton.closest(".usr-rvw-item__ftr-left").html("Thanks for reporting!").fadeOut(5000, function () {
                voteButton.remove();
            });
        }

        // click handler function that runs evertime user clicks.
        return function() {
            loginCallback(voteReview, this, [$(this)]);
            return false;
        }
    })());

    $doc.on("click", ".js-usr-rvw__rprt-spam", function () {
        var reviewId = $(this).closest(".usr-rvw-item").data("review-id"),
            mspId = PriceTable.dataPoints.mspid;

        $.post("/msp/review/post_vote.php", {
            reviewid: reviewId,
            mspid: mspId,
            flag: "report_spam"
        });

        $(this).removeClass("text-link").html("Thanks for reporting!").css("cursor", "default").fadeOut(1000, function () {
            $(this).remove();
        });

        return false;
    });

    ;(function() {
        var ratingWidth = $(".usr-rvw-form__rtng-wrpr .rtng-star").width(),
            $ratingInr = $(".usr-rvw-form__rtng-wrpr .rtng-star__inr"),
            $ratingRemark = $(".usr-rvw-form__rtng-rmrk"),
            remarksList = $ratingRemark.data("remarks").split(","),
            $ratingInput = $(".usr-rvw-form__rtng-inpt");
            isUserDetailsDisplayed = false;

        if (getCookie("msp_login") === "1") {
            $(".usr-rvw-form__dtls-img").attr("src", getCookie("msp_user_image"));
            $(".usr-rvw-form__dtls-name").html(getCookie("msp_login_name") || "MySmartPrice User");
            $(".usr-rvw-form__dtls-email").html(getCookie("msp_login_email"));
            $(".usr-rvw-form__dtls").show();
            isUserDetailsDisplayed = true;
        }

        $doc.on("mousemove", ".usr-rvw-form__rtng-wrpr .rtng-star", function(e) {
            var offsetX = parseInt(e.pageX - $(this).offset().left, 10),
                rating = Math.ceil((offsetX / ratingWidth) * 5) || 1;

            $ratingRemark.text(remarksList[rating - 1]);
            if (offsetX <= ratingWidth) {
                $ratingInr.width((rating * 20) + "%");
            }
        });

        $doc.on("click", ".usr-rvw-form__rtng-wrpr .rtng-star", function() {
            var inrWidth = $ratingInr.width(),
                rating = Math.ceil((inrWidth / ratingWidth) * 5) || 1;
            
            $ratingRemark.data("remark", $ratingRemark.text());
            $ratingInput.val(rating);
            $ratingInr.data("width", inrWidth).addClass("rtng-star__inr--rated");
        });

        $doc.on("mouseleave", ".usr-rvw-form__rtng-wrpr .rtng-star", function() {
            if ($ratingInr.hasClass("rtng-star__inr--rated")) {
                $ratingRemark.text($ratingRemark.data("remark"));
                $ratingInr.width($ratingInr.data("width"));
            } else {
                $ratingInr.width(0);
                $ratingRemark.empty();
            }
        });

        $doc.on("click", ".js-usr-rvw-item-more", function() {
            $(this).hide();
            $(this).closest(".usr-rvw-item__text").find(".usr-rvw-item__text-hide").fadeIn();
        });

        $doc.on("submit", ".usr-rvw-form", function() {
            loginCallback(function() {
                MSP.utils.validate.form([{
                    "type" : "rating",
                    "inputField" : $(".usr-rvw-form__rtng-inpt"),
                    "errorNode" : $(".usr-rvw-form__rtng-err")
                },{
                    "type" : "text",
                    "inputField" : $(".usr-rvw-form__ttl"),
                    "errorNode" : $(".usr-rvw-form__ttl-err"),
                    "options" : { "min" : 20 }
                },{
                    "type" : "text",
                    "inputField" : $(".usr-rvw-form__desc"),
                    "errorNode" : $(".usr-rvw-form__desc-err"),
                    "options" : { "min" : 100 }
                }]).done(function() {
                    var rating = $(".usr-rvw-form__rtng-inpt").val(),
                        title = $(".usr-rvw-form__ttl").val(),
                        details = $(".usr-rvw-form__desc").val(),
                        errorMessage = "There was a problem submitting your review. Please try again.";
                    
                    $.ajax({
                        type: "POST",
                        url: "/msp/review/save_a_review.php" ,
                        data: {
                            "mspid": PriceTable.dataPoints.mspid,
                            "title": title,
                            "details": details,
                            "rating_review": rating,
                            "email_id": getCookie("msp_login_email")
                        }
                    }).done(function (response) {
                        if (response === "SUCCESS") {
                            $(".usr-rvw-form").hide();
                            $(".usr-wrt-rvw__scs").fadeIn();
                            $(".usr-rvw-form").data("submitted", true);
                        } else {
                            alert(errorMessage);
                        }
                    }).fail(function () {
                        alert(errorMessage);
                    });
                });
            });
            return false;
        });
        

        // Refer https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload#Example
        window.onbeforeunload = function (e) {
            var message = "You have not finished submitting your review.";
            if (!$(".usr-rvw-form").data("submitted") && $.trim($(".usr-rvw-form__desc").val()).length) {
                (e || window.event).returnValue = message; // Gecko + IE
                return message; // Gecko + Webkit, Safari, Chrome etc.
            }
        } 
    }()); 

     MSP.utils.lazyLoad.assign({ 
        "node" : $(".prc-grph"),
        "isStatic" : true,
        "callback" : {
            "definition" : function() {
                if ($(".prc-grph__not-sprtd").length) {
                    $(".prc-grph__not-sprtd").show();
                    $(".prc-grph__ldr").hide();
                    return;
                }

                $("head").append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css">');
                
                $.getScript("https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js", function() {
                    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js", function() {
                        $.getScript("assets/js/priceGraph.js", function() {
                            $(".prc-grph__rght-chrt").show();
                            $(".prc-grph__btn-wrpr").show();
                            $(".prc-grph__ldr").hide();
                        });
                    });
                });
            },
            "context": window,
            "arguments" : [] 
        }
    }).run(); 
});

// Price Alert Functionality - commented out here (fn. exists in msp.js of new and old site for now)
// Later :: functionality to be implemented in single.js(this) file
// $doc.ready(function () {
//     // Mobile number capture popup for users who land on single page
//     // from price alert emailer and missed the drop in price
//     if (qS && qS.utm_campaign === "PriceAlert") {
//         var _hash = queryString(window.location.hash);
//         if (_hash.price) {
//             var $mspSingleTitle = $("#mspSingleTitle");
//             if ($mspSingleTitle.length) {
//                 var emailPrice = parseInt(_hash.price, 10),
//                     bestPrice = parseInt($mspSingleTitle.data("bestprice"), 10);
//                 if (bestPrice > emailPrice) {
//                     openPopup("/price_alert/paepopup.php?mspid=" + $mspSingleTitle.data("mspid"));
//                 }
//             }
//         }
//     }
// });