var $ = jQuery,
    timerInterval;
var ListPage = {
    "settings" : {
        "filterLength" : 8
    },
    "controller" : {
        "init" : function() {
            var lp_changes = ListPage.model.params.changes,
                lp_defaults = ListPage.model.params.defaults,
                lp_current = ListPage.model.params.current,
                lp_page = ListPage.model.params.page,
                lp_filterPlugins = ListPage.controller.filterPlugins,
                lp_clipboard = ListPage.model.clipboard;

            // get page params and default values to get default filters to be applied.
            ListPage.controller.getDefaults();
            
            lp_filterPlugins.init({
                "priceSlider" : {
                    "min" : lp_page.price ? lp_page.price.split(";")[0] : lp_defaults.priceMin,
                    "max" : lp_page.price ? lp_page.price.split(";")[1] : lp_defaults.priceMax
                }
            });
            ListPage.controller.updatePage();

            // Add listeners to all inputs for applying or removing filters
            ;(function addActionListeners() {
                var clearGroupQueue = [],
                    listenerTypes = [
                        ".fltr:not([data-groupname='price']) .js-fltr-val--mltpl:not(.js-fltr-val--dsbl) input",
                        ".fltr:not([data-groupname='price']) .js-fltr-val--sngl:not(.js-fltr-val--dsbl) input",
                        ".fltr[data-groupname='price'] .js-fltr-val--sngl:not(.js-fltr-val--dsbl) input"
                    ];


                // globalSearch is comes from from hash so no listener.

                // localSearch within the loaded product list
                $('.list-hdr-srch').on('submit', function() {
                    var localSearch = $.trim($(this).find('.list-hdr-srch__fld').val());
                    if (localSearch !== "") {
                        lp_changes.add.ss = localSearch;
                    } else if (lp_clipboard.prevLocalSearch) {
                        lp_changes.remove.ss = lp_clipboard.prevLocalSearch;
                    } else {
                        return false;
                    }

                    lp_changes.inFilterBox = false;
                    ListPage.controller.updatePage();
                    return false;
                });

                $('.list-hdr-srch__btn').on("click", function() {
                    $('.list-hdr-srch').submit();
                });

                // onclick a non-price multi value filter.
                $doc.on("click", ".fltr:not([data-groupname='price']) .js-fltr-val--mltpl:not(.js-fltr-val--dsbl) input", function() {
                    var groupName = $(this).closest(".fltr").data("groupname");

                    if (clearGroupQueue.length === 0) {
                        $.merge(clearGroupQueue, $(this));
                    }
                    $(clearGroupQueue).each(function (i, item) {
                        var context = (!lp_current.property || lp_current.property.indexOf($(item).attr("value")) === -1) ? "add" : "remove",
                            changes = lp_changes[context];
                        
                        changes.property = changes.property || [];
                        changes.property.push($(item).attr("value"));
                    });
                    clearGroupQueue = [];

                    lp_changes.inFilterBox = true;
                    ListPage.controller.updatePage();
                });
                
                // onclick a non-price single value filter.
                $doc.on("click", ".fltr:not([data-groupname='price']) .js-fltr-val--sngl:not(.js-fltr-val--dsbl) input", function() {
                    var groupName = $(this).closest(".fltr").data("groupname");
                    if (clearGroupQueue.length === 0) {
                        $.merge(clearGroupQueue, $(this).closest(".fltr").find(".fltr-val__inpt:checked"));
                    }
                    $(clearGroupQueue).each(function (i, item) {
                        var context = lp_current[groupName] !== $(item).attr("value") ? "add" : "remove",
                            changes = lp_changes[context];
                        
                        changes.property = changes.property || [];
                        changes.property.push($(item).attr("value"));
                    });
                    clearGroupQueue = [];

                    lp_changes.inFilterBox = true;
                    ListPage.controller.updatePage();
                });
                
                // onclick a price single value filter.
                $doc.on("click", ".fltr[data-groupname='price'] .js-fltr-val--sngl:not(.js-fltr-val--dsbl) input", function() {
                    var filterVal = $(this).attr("value"),
                        values = filterVal.split(";"),
                        minPrice = parseInt(values[0], 10),
                        maxPrice = parseInt(values[1], 10),
                        context = (lp_current.price !== $(this).attr("value")) ? "add" : "remove",
                        displayPrices = {};
                    
                    $.extend(lp_changes[context], {
                        "price" : minPrice + ";" + maxPrice
                    });

                    lp_changes.inFilterBox = true;
                    ListPage.controller.updatePage();
                });
                
                // clear all apllied filters in a filtergroup
                $doc.on("click", ".fltr__cler", function() {
                    var $currentGroup = $(this).closest(".fltr"),
                        groupname = $currentGroup.data("groupname"),
                        $activeFilters = $currentGroup.find(".fltr-val__inpt:checked");
                    if (groupname === "price") {
                        $.extend(lp_changes.remove, {
                            "price" : lp_clipboard.prevMinPrice + ";" + lp_clipboard.prevMaxPrice
                        });

                        lp_changes.inFilterBox = true;
                        ListPage.controller.updatePage();
                    } else {
                        $.merge(clearGroupQueue, $currentGroup.find("input:checked"));
                        $activeFilters.eq(0).click();
                    }
                });
                
                // edit min and max price numbers in inputfiled
                $doc.on("change", ".js-fltr-prc__inpt-min, .js-fltr-prc__inpt-max", function() {
                    var numRegEx = /^[0-9]+$/,
                        $maxPriceInpt = $(".js-fltr-prc__inpt-min"),
                        $minPriceInpt = $(".js-fltr-prc__inpt-max"),
                        minPrice = $minPriceInpt.val(),
                        maxPrice = $maxPriceInpt.val(),
                        lp_clipboard = ListPage.model.clipboard;

                    if (numRegEx.test(minPrice) && numRegEx.test(maxPrice)) {
                        minPrice = parseInt(minPrice, 10);
                        maxPrice = parseInt(maxPrice, 10);
                        if (minPrice < maxPrice) {
                            if (minPrice < lp_defaults.priceMin) {
                                minPrice = lp_defaults.priceMin;
                                $minPriceInpt.val(minPrice);
                            }
                            if (maxPrice > lp_defaults.priceMax) {
                                maxPrice = lp_defaults.priceMax;
                                $maxPriceInpt.val(maxPrice);
                            }
                            if (minPrice !== lp_defaults.priceMin || maxPrice !== lp_defaults.priceMax) {
                                // if new price range is subset of total range then apply filter
                                $.extend(lp_changes.add, {
                                    "price" : minPrice + ";" + endinr
                                });
                            } else {
                                // if new price range is total range then remove existing price filter.
                                $.extend(lp_changes.remove, {
                                    "price" : lp_clipboard.prevMinPrice + ";" + lp_clipboard.prevMaxPrice
                                });
                            }

                            lp_changes.inFilterBox = true;
                            ListPage.controller.updatePage();
                            return;
                        }
                    }
                    $minPriceInpt.val(lp_clipboard.prevMinPrice);
                    $maxPriceInpt.val(lp_clipboard.prevMaxPrice);
                });
                
                ;(function AppliedFilterHandler() {
                    var remfilterQueue = [];
                    function removeAppliedFilters() {
                        var filterVal, $filterItem, minPrice, maxPrice;
                        
                        // batch changes(DOM write operatations ie. to uncheck filters/remove tags) to trigger only one render operation.
                        $.each(remfilterQueue, function (i, filter) {
                            if ($(filter).closest(".js-fltrs-apld").data("groupname") === "searchTerm") {
                                lp_changes.remove.s = $(filter).data("value");
                            } else if ($(filter).closest(".js-fltrs-apld").data("groupname") === "localSearch") {
                                lp_changes.remove.ss = $(filter).data("value");
                            } else if ($(filter).closest(".js-fltrs-apld").data("groupname") === "price") {
                                $.extend(lp_changes.remove, {
                                    "price" : $(filter).data("value")
                                });
                            } else {
                                filterVal = $(filter).data("value");
                                $filterItem = $('.fltr-val__inpt[value="' + filterVal + '"]').closest(".fltr-val");
                                if ($filterItem.is(":not(.fltr-val--dsbld)")) {
                                    if ($filterItem.is(".js-fltr-val--mltpl") && clearGroupQueue.length === 0) {
                                        $.merge(clearGroupQueue, $filterItem.find("input"));
                                    } else if ($filterItem.is(".js-fltr-val--sngl") && clearGroupQueue.length === 0) {
                                        $.merge(clearGroupQueue, $filterItem.closest(".fltr").find("input:checked"));
                                    }
                                    $.each(clearGroupQueue, function (i, item) {
                                        lp_changes.remove.property = lp_changes.remove.property || [];
                                        lp_changes.remove.property.push($(item).attr("value"));
                                    });
                                    clearGroupQueue = [];
                                } else {}
                            }
                        });
                        remfilterQueue = [];

                        lp_changes.inFilterBox = false;
                        ListPage.controller.updatePage();
                    }

                    // remove applied filter by clicking tags shown above product list.
                    $(".js-fltrs-apld-wrpr1").on("click", ".js-fltrs-apld__item", function removeTag() {
                        $.merge(remfilterQueue, $(this));
                        removeAppliedFilters();
                    });

                    // remove applied filter by clicking tags shown above product list.
                    $(".js-fltrs-apld-wrpr1").on("click", ".js-fltrs-apld__lbl", function removeTag() {
                        $.merge(remfilterQueue, $(this).closest(".js-fltrs-apld").find(".js-fltrs-apld__item"));
                        removeAppliedFilters();
                    });

                    $(".js-fltrs-apld-wrpr1").on("mouseover", ".js-fltrs-apld__lbl", function removeTag() {
                        $(this).closest(".js-fltrs-apld").addClass("js-fltrs-apld--strk");
                    }).on("mouseout", ".js-fltrs-apld__lbl", function() {
                        $(this).closest(".js-fltrs-apld").removeClass("js-fltrs-apld--strk");
                    });

                    $(".js-fltrs-apld-wrpr1").on("click", ".js-fltrs-apld-cler", function() {
                        $(".js-fltrs-apld__item").each(function() {
                            $.merge(remfilterQueue, $(this));
                        });
                        removeAppliedFilters();
                    });
                }());
                
                // sorting options.
                $("body").on("change", ".js-list-sort", function() {
                    var sortVal = $(this).val();
                    lp_changes.add.sort = sortVal;

                    lp_changes.inFilterBox = false;
                    ListPage.controller.updatePage();
                });
                
                // pagination.
                $(".pgntn").on("click",".js-pgntn__item", function() {
                    if(!$(this).hasClass("pgntn__item--crnt")) {
                        var pgno = $(this).data("pgno");
                        lp_changes.add.page = pgno;

                        lp_changes.inFilterBox = false;
                        ListPage.controller.updatePage();
                    }
                    return false;
                });
            }());
        },
        "getDefaults" : function() {
            var lp_defaults = ListPage.model.params.defaults,
                lp_clipboard = ListPage.model.clipboard,
                pageParams = (function() {
                    var $bodyWrapper = $(".body-wrpr"),
                        params = {},
                        startInr, endInr;

                    if ($bodyWrapper.data("category")) {
                        params.subcategory = $bodyWrapper.data("category");
                    }
                    if ($bodyWrapper.data("start_price") || $bodyWrapper.data("end_price")){
                        startInr = parseInt($bodyWrapper.data("start_price") || $(".js-fltr-prc__inpt-min").attr("val"), 10);
                        endInr = parseInt($bodyWrapper.data("end_price") || $(".js-fltr-prc__inpt-max").attr("val"), 10);
                        params.price = startInr + ";" + endInr;
                    }
                    if ($bodyWrapper.data("brand")) {
                        params.property = params.property || "";
                        params.property += $(".fltr-val__inpt[dispname='" + $bodyWrapper.data("brand") + "']").attr("value") + "|";
                    }
                    if ($bodyWrapper.data("property")) {
                        params.property = params.property || "";
                        params.property += $bodyWrapper.data("property") + "|";
                    }
                    if ($bodyWrapper.data("properties")) {
                        params.property = params.property || "";
                        params.property += $bodyWrapper.data("properties");
                    }

                    if (params.property) {
                        params.property = $.grep(params.property.split("|").sort(), function (e, i) { return (e !== ""); });
                    }
                    
                    return params;
                }());

            $.extend(ListPage.model.params.page, pageParams);

            // get supported values of min and max price values by the slider.
            $.extend(lp_defaults, {
                "priceMin" : parseInt($(".fltr-prc__sldr").attr("value").split(";")[0], 10),
                "priceMax" : parseInt($(".fltr-prc__sldr").attr("value").split(";")[1], 10)
            });

            // store inital values as previous values when values change.
            $.extend(lp_clipboard, {
                "prevMinPrice" : lp_defaults.priceMin,
                "prevMaxPrice" : lp_defaults.priceMax
            });
        },
        "filterPlugins" : {
            "init" : function (settings, replacedGroups) {
                ListPage.controller.filterPlugins.nanoScrollbarInit(replacedGroups);
                ListPage.controller.filterPlugins.priceSlider.init(settings.priceSlider, replacedGroups);
            },
            "priceSlider" : {
                "init" : function(settings, replacedGroups) {
                    var minPrice = settings.min,
                        maxPrice = settings.max,
                        minSlider = minPrice ? this.priceToRange(minPrice) : 0,
                        maxSlider = maxPrice ? this.priceToRange(maxPrice) : 200,
                        lp_changes = ListPage.model.params.changes,
                        lp_filterPlugins = ListPage.controller.filterPlugins;

                    if ($.isArray(replacedGroups) && replacedGroups.indexOf("price") === -1) {
                        return;
                    }

                    $(".fltr-prc__sldr").slider({
                        range: true,
                        min: 0,
                        max: 200,
                        values: [minSlider || 0, maxSlider || 200],
                        step: 1,
                        animate: true,
                        slide: lp_filterPlugins.priceSlider.callback,
                        stop: function (a, b) {
                            var startInr, endInr;

                            if (b.values[0] === 0 && b.values[1] === 200) {
                                startInr = ListPage.model.clipboard.prevMinPrice;
                                endInr = ListPage.model.clipboard.prevMaxPrice;
                                
                                // if range is equal to total range then remove price filter
                                lp_changes.remove.price = startInr + ";" + endInr;
                            } else {
                                startInr = lp_filterPlugins.priceSlider.rangeToPrice(b.values[0]);
                                endInr = lp_filterPlugins.priceSlider.rangeToPrice(b.values[1]);
                                
                                // if range is not equal to total range then add new price filter
                                lp_changes.add.price = startInr + ";" + endInr;
                            }

                            lp_changes.inFilterBox = true;
                            ListPage.controller.updatePage();
                            $(".fltr-prc__sldr").slider("values", [b.values[0], b.values[1]]);
                        }
                    });

                    if (minPrice || maxPrice) {
                        $(".js-fltr-prc__inpt-min").val(minPrice || ListPage.model.params.defaults.price.split(";")[0]);
                        $(".js-fltr-prc__inpt-max").val(maxPrice || ListPage.model.params.defaults.price.split(";")[1]);
                    }
                },
                // get price value from slider range value
                "rangeToPrice" : function (a) {
                    var priceMin = ListPage.model.params.defaults.priceMin,
                        priceMax = ListPage.model.params.defaults.priceMax,
                        b = Math.exp(Math.log(priceMax / priceMin) / 200),
                        priceValue = priceMin * Math.pow(b, a),
                        roundOff = Math.pow(10, Math.floor(Math.log(priceValue - (priceValue / b)) / Math.log(10)));
                    
                    priceValue = Math.ceil(priceValue / roundOff) * roundOff;
                    if (a === 0 || priceValue < priceMin) return priceMin;
                    else if (a == 200 || priceValue > priceMax) return priceMax;
                    else return priceValue;
                },
                // get slider range from price value
                "priceToRange" : function (price) {
                    var result = (function binarySearch(a, fn, min, max) {
                        binarySearch.old = binarySearch.current;
                        binarySearch.current = Math.floor((min + max)/2);
                        if (binarySearch.old === binarySearch.current) {
                            return binarySearch.current;
                        }
                        if (a > fn(binarySearch.current)) {
                            min = binarySearch.current;
                        } else if (a < fn(binarySearch.current)) {
                            max = binarySearch.current;
                        } else {
                            return binarySearch.current;
                        }
                        return binarySearch (a, fn, min, max);
                    }(price, ListPage.controller.filterPlugins.priceSlider.rangeToPrice, 0, 200));
                    return result;
                },
                // run this function while sliding the price slider.
                "callback" : function (a, b) {
                    var minPrice, maxPrice;
                    if ((b.values[0] + 1) >= b.values[1]) {
                        return false;
                    }
                    minPrice = ListPage.controller.filterPlugins.priceSlider.rangeToPrice(b.values[0]);
                    maxPrice = ListPage.controller.filterPlugins.priceSlider.rangeToPrice(b.values[1]);
                    $(".js-fltr-prc__inpt-min").val(minPrice);
                    $(".js-fltr-prc__inpt-max").val(maxPrice);
                },
            },
            // init nanoscrollbar plugin to get overflow scroll to filterGroups
            "nanoScrollbarInit" : function(filterGroups) {
                var $nanoElements;

                if (filterGroups) {
                    $nanoElements = $(".fltr-val-wrpr.nano").filter(function() {
                        return filterGroups.indexOf($(this).closest(".fltr").data("groupname")) !== -1;
                    });
                } else {
                    $nanoElements = $(".fltr-val-wrpr.nano");
                }

                $nanoElements.each(function() {
                    var totalHeight;
                    $filteritem = $(".fltr-val", $(this));
                    if ($filteritem.length <= ListPage.settings.filterLength) {
                        totalHeight = 0;
                        $filteritem.each(function() {
                            totalHeight += $(this).outerHeight(true);
                        });
                        if (totalHeight < 224) $(this).css("height", totalHeight + 'px');
                    }
                });
                $nanoElements.nanoScroller({
                    alwaysVisible: true
                });
            },
        },
        // once changes are update the page state before rendering the view.
        "updatePage" : function() {
            var lp_current = ListPage.model.params.current,
                lp_changes = ListPage.model.params.changes,
                lp_defaults = ListPage.model.params.defaults,
                lp_page = ListPage.model.params.page,
                lp_clipboard = ListPage.model.clipboard,
                lp_services = ListPage.services,
                initHash, prop_strings;

            lp_clipboard.isOnLoad = $.isEmptyObject(lp_current);
            lp_current.subcategory = lp_current.subcategory || lp_page.subcategory;
                
            // Clear list page deals countdown timer
            clearInterval(timerInterval); 

            if (!lp_clipboard.isOnLoad) {
                //apply additions in current state params
                $.each(lp_changes.add, function (key) {
                    if (key === "property") {
                        if (typeof lp_changes.add.property === "object") {
                            lp_current.property = lp_current.property || [];
                            $.merge(lp_current.property, lp_changes.add.property);
                        }
                    } else {
                        lp_current[key] = lp_changes.add[key];
                    }
                });
                //apply deletions in current state params
                $.each(lp_changes.remove, function(key) {
                    var index;
                    if (key === "property") {
                        if ("property" in lp_changes.remove) {
                            $.each(lp_changes.remove.property, function(i, removedProperty) {
                                index = lp_current.property.indexOf(removedProperty);
                                lp_current.property.splice(index, 1);
                            });
                            if (lp_current.property.length === 0) {
                                delete lp_current.property;
                            }
                        }
                    } else {
                        delete lp_current[key];
                    }
                });
            } else {
                // if isOnLoad get current params from url hash.
                $.extend(lp_current, lp_services.filterHash.toParams(window.location.hash));

                (function() {
                    var currentLength = 0;
                    $.each(lp_current, function() { currentLength++; });

                    // if no hash or if its a quicklink page inherit page params.
                    if (currentLength === 1 || lp_current.ql === "1") {
                        $.each(lp_page, function (param, pageParamValue) {
                            if ($.isArray(pageParamValue)) {
                                if (!$.isArray(lp_current[param])) { lp_current[param] = [] }
                                $.each(pageParamValue, function(i, prop) {
                                    if (lp_current[param].indexOf(prop) === -1) {
                                        lp_current[param].push(prop);
                                    }
                                });
                            } else {
                                lp_current[param] = pageParamValue;
                            }
                        });
                        delete lp_current.ql;
                    }
                    // since every registered params on current is new add them to changes also.
                    $.each(lp_current, function (key) {
                        if (key !== "subcategory") {
                            lp_changes.add[key] = lp_current[key];
                        }
                    });
                })();
                lp_clipboard.isLoadParamsEqualtoPageParams = (ListPage.services.filterHash.fromParams(lp_current) === ListPage.services.filterHash.fromParams(lp_page));
            }

            //generate new hash, and start view rendering.
            ListPage.model.hash = ListPage.services.filterHash.fromParams(lp_current);
            ListPage.view.render.init();
        }
    },
    "model" : {
        "hash" : "",
        "params" : {
            "current" : {},
            /* {
                "s" : "", //globalSearch
                "ss" : "", //localSearch
                "subcategory" : "", 
                "price" : startInr + ";" + endInr,
                "property" : [],
                "sort" : "", 
                "page" : "" //pagination no
            } */
            "changes" : {
                "add" : {},
                "remove" : {},
            },
            "page" : {},
            "defaults" : {}
        },
        // mode of tranferring valued from one component(M, V, C) to another.
        "clipboard" : {
            "prevMinPrice" : "",
            "prevMaxPrice" : "",
            "slider" : {}
        }
    },
    "view" : {
        "render" : {
            "init" : function() {
                var lp_current = ListPage.model.params.current,
                    lp_changes = ListPage.model.params.changes,
                    lp_defaults = ListPage.model.params.defaults,
                    lp_page = ListPage.model.params.page,
                    lp_clipboard = ListPage.model.clipboard,
                    lp_filterPlugins = ListPage.controller.filterPlugins,
                    filterControls;
                
                window.location.hash = ListPage.model.hash;
                
                if (lp_clipboard.isOnLoad) {
                    $(".list-main__ttl, .list-info__dscrptn, .list-info__link-wrpr").show();
                }
                if (ListPage.services.filterHash.fromParams(lp_current) !== ListPage.services.filterHash.fromParams(lp_page)) {
                    $(".list-main__ttl, .list-info__dscrptn, .list-info__link-wrpr").hide();
                    $(".js-list-ttl").html($(".list-info__ttl").html());
                }

                ;(function updateProductListAndOtherWidgets() {
                    // get new product list and filters based on updated current params
                    if ($(".body-wrpr").length !== 0) {
                        ListPage.services.fetch.productList().done(function (response) {
                            var freshData = response.split("//&//#"),
                                lp_filterPlugins = ListPage.controller.filterPlugins;
                            ListPage.model.params.current.page = undefined;
                            // load new filters
                            $(".fltr-wrpr1").html(freshData[0]);

                            if (lp_changes.inFilterBox) {
                                // manipulate loaded filter html
                                var $filterDOM = $(freshData[0]),
                                    $groupsToReplaceDOM, 
                                    replacedGroups = [];
                                $groupsToReplaceDOM = $filterDOM.find(".fltr").filter((function functionClosure() {
                                    var affectedGroups = (function() {
                                        var result = [];
                                        $.each(["add", "remove"], function(i, context) {
                                            if ("price" in lp_changes[context]) {
                                                result.push("price");
                                            }
                                            if ("property" in lp_changes[context]) {
                                                $.each(lp_changes[context].property, function(i, propValue) {
                                                    var groupname = $(".fltr-val[value='" + propValue + "']").closest(".fltr").data("groupname");
                                                    result.push(groupname);
                                                });
                                            }
                                        });
                                        return result;
                                    })();
                                    return function filterFunction() {
                                        return affectedGroups.indexOf($(this).data("groupname")) === -1;
                                    }
                                })());
                                $groupsToReplaceDOM.each(function() {
                                    var $newFilterDOM = $(this),
                                        groupname = $newFilterDOM.data("groupname"),
                                        $exisingFilterDOM = $(".fltr[data-groupname='" + groupname + "']");
                                    replacedGroups.push(groupname);
                                    $exisingFilterDOM.replaceWith($newFilterDOM);
                                });

                                lp_filterPlugins.init({
                                    "priceSlider" : {
                                        "min" : lp_clipboard.slider.priceMin,
                                        "max" : lp_clipboard.slider.priceMax
                                    }
                                }, replacedGroups);
                            } else {
                                // load new filters
                                $(".fltr-wrpr1").html(freshData[0]);
                                lp_filterPlugins.init({
                                    "priceSlider" : {
                                        "min" : lp_clipboard.slider.priceMin,
                                        "max" : lp_clipboard.slider.priceMax
                                    }
                                });
                            }

                            if (!lp_clipboard.isLoadParamsEqualtoPageParams) {
                                // load new products
                                $(".js-prdct-grid-main").html(freshData[1]);
                                $(".js-prdct-pgntn").replaceWith(freshData[2]);
                                // update product count data  above product list
                                
                                // $(".list-prod-count").text($(".product-list .product-count-from-ajax").data('count'));
                                // $(".list-prod-count-total").text($(".product-list .product-count-from-ajax").data('total'));
                            } else {
                                lp_clipboard.isLoadParamsEqualtoPageParams = false;
                            }
                        });
                    }

                    // get new hourly deals based on updated current params
                    if ($(".js-hrly-deals-grid").length) {
                        ;(function _getHourlyDeals() {
                            var $hourlyDealsWidget = $(".js-hrly-deals-grid");

                            ListPage.services.fetch.hourlyDeals().done(function(html) {
                                var $timer, dataMinutes, dataSeconds, timerStart, clockStart,
                                    timerHtml = html.split("//&//#")[0],
                                    productsHtml = html.split("//&//#")[1];


                                function parseTime(value) {
                                    value = parseInt(value, 10);
                                    return (isNaN(value) || value < 0 || value > 59) ? 59 : value;
                                }

                                $hourlyDealsWidget.find(".sctn__inr").html(productsHtml);
                                $hourlyDealsWidget.find(".js-hrly-deals__cntdwn-wrpr").html(timerHtml);
                                
                                if ($(productsHtml).filter(".prdct-item-with-bdg").length > 2) {
                                    $hourlyDealsWidget.find(".sctn__view-all-link").show();
                                } else {
                                    $hourlyDealsWidget.find(".sctn__view-all-link").hide();
                                }

                                $timer = $hourlyDealsWidget.find(".cntdwn");
                                if ($timer.length) {
                                    dataMinutes = parseTime($timer.find(".cntdwn__mins").data("minutes"));
                                    dataSeconds = parseTime($timer.find(".cntdwn__scnds").data("seconds"));
                                    timerStart = dataMinutes * 60 + dataSeconds;
                                    clockStart = parseInt(+new Date() / 1000, 10);

                                    if (!(dataMinutes === 0 && dataSeconds === 0)) {
                                        timerInterval = setInterval((function timer() {
                                            var elapsedTime = (Math.floor(+new Date() / 1000) - clockStart),
                                                minutes = Math.floor((timerStart - elapsedTime) / 60),
                                                seconds = (timerStart - elapsedTime) % 60;
                                            
                                            if (seconds <= 0) {
                                                seconds = 59;
                                                if (minutes <= 0) {
                                                    clearInterval(timerInterval);
                                                    _getHourlyDeals();
                                                    return;
                                                }
                                            }
                                            $timer.find(".cntdwn__mins").text(minutes < 10 ? "0" + minutes : minutes);
                                            $timer.find(".cntdwn__scnds").text(seconds < 10 ? "0" + seconds : seconds);
                                            return timer;
                                        }()), 1000);
                                    } else {
                                        $timer.hide();
                                        $hourlyDealsWidget.find(".hrly-deals-expry-lbl").hide();
                                    }
                                }
                            }).fail(function() {
                               $hourlyDealsWidget.find(".cntdwn").hide();
                               $hourlyDealsWidget.find(".hrly-deals-expry-lbl").hide();
                            });
                        }());
                    }
                }());

                // operations to be done to add/remove filters.
                filterControls = {
                    "add" : function() {
                        var $filterGroupOptions,
                            appliedFilterComponents = ListPage.view.components.appliedFilter;
                        
                        // initialize all filtergroups, cleargroups as inactive and activate based on current params
                        $(".fltr__cler").hide();
                        //$('.fltr__val').removeClass('active');
                        
                        // apply all filters registered on filterControls.add.queue
                        $.each(filterControls.add.queue, function (i, filterItem) {
                            // batch html of all the filters to append all filter tags in one go.
                            if ("unitValue" in filterItem) {
                                $filterGroupOptions = $(".fltr[data-groupname='" + filterItem.groupName + "'] .fltr-val__inpt");
                                if ($filterGroupOptions.closest(".fltr-val").hasClass("js-fltr-val--sngl") || filterItem.groupName == "localSearch") {
                                    $(".js-fltrs-apld[data-groupname='" + filterItem.groupName + "']").remove();
                                }
                                $filterGroupOptions.filter("[value='" + filterItem.unitValue + "']").prop("checked", true);
                                $filterGroupOptions.closest(".fltr").find(".fltr__cler").show();
                            }
                            if (filterItem.groupName == "price") {
                                // update priceSlider range points
                                $(".fltr-prc__sldr").slider("values", [
                                    lp_filterPlugins.priceSlider.priceToRange(filterItem.unitValue.split(";")[0]),
                                    lp_filterPlugins.priceSlider.priceToRange(filterItem.unitValue.split(";")[1])
                                ]);
                                $(".js-fltr-prc__inpt-min").val(filterItem.unitValue.split(";")[0]);
                                $(".js-fltr-prc__inpt-max").val(filterItem.unitValue.split(";")[1]);
                            }
                            // batch html of all the filters to append all filter tags in one go.
                            if ($(".js-fltrs-apld[data-groupname='" + filterItem.groupName + "']").length !== 0) {
                                $(".js-fltrs-apld[data-groupname='" + filterItem.groupName + "']").append(appliedFilterComponents.unit(filterItem));
                            } else {
                                $(".js-fltrs-apld-wrpr").append(appliedFilterComponents.group(filterItem));
                            }
                        });
                        
                        if (filterControls.add.queue.length !== 0) {
                            $(".js-fltrs-apld-wrpr1").show();

                            ;(function showFollowThisSearchButton() {
                                var subcatName = $('.body-wrpr').data('listname'),
                                    subcatCode = $('.body-wrpr').data('listcode'),
                                    filterHash = encodeURIComponent(location.hash),
                                    hrefVal = "../../promotions/savesearchpopup.php?subcatname="+encodeURIComponent(subcatName)+"&subcatcode="+encodeURIComponent(subcatCode)+"&filterhash="+filterHash;
                                $(".list-hdr__save").data("href", hrefVal).show();
                            }());
                        }
                    },
                    "remove" : function() {
                        // remove all filters registered on filterControls.remove.queue
                        $.each(filterControls.remove.queue, function (i, filterItem) {
                            var $remfilterGrp = $(".js-fltrs-apld[data-groupname='" + filterItem.groupName + "']"),
                                $remfilterUnit = $remfilterGrp.find(".js-fltrs-apld__item[data-value='" + filterItem.unitValue + "']"),
                                $filterOption = $(".fltr-val__inpt[value='" + filterItem.unitValue + "']");

                            if ($remfilterGrp.find(".js-fltrs-apld__item").length === 1) {
                                $remfilterGrp.remove();
                            } else {
                                $remfilterUnit.remove();
                            }

                            // FIXME:: on clearing --multi filter block first item remains selected
                            // -> setTimeout is a temporary fix to do unchecking after handler is executed.
                            setTimeout(function() {
                                $filterOption.prop("checked", false);
                            }, 0);
                            
                            if ($filterOption.closest(".fltr").find(".fltr-val__inpt:checked").length === 0) {
                                $filterOption.closest(".fltr").find(".fltr__cler").hide();
                            }
                            
                            if (filterItem.groupName === "price") {
                                // update priceSlider range points
                                $(".fltr-prc__sldr").slider("values", [ 0, 200 ]);
                                $(".js-fltr-prc__inpt-min").val(lp_defaults.priceMin);
                                $(".js-fltr-prc__inpt-max").val(lp_defaults.priceMax);
                            }
                        });

                        // if all filter tags removed remove "clear all" filter tag also
                        if ($(".js-fltrs-apld").length === 0) {
                            $(".js-fltrs-apld-wrpr1").hide();
                            $(".list-hdr__save").hide();
                        }
                    }
                };
                
                // after all filters added/removed reinitialize queue to empty.
                filterControls.add.queue = [];
                filterControls.remove.queue = [];
                
                // register all filter changes to filterControls queue to batch applying and removing operations.
                $.each(["add", "remove"], function (i, action) {
                    if ("s" in lp_changes[action]) {
                        $(".js-hdr-srch").val(lp_changes[action].s);
                        filterControls[action].queue.push({
                            "unitValue" : lp_changes[action].s,
                            "unitLabel" : lp_changes[action].s,
                            "groupName" : "searchTerm",
                            "groupLabel" : "Search"
                        });
                    }
                    if ("sort" in lp_changes[action]) {
                        $('.fltr-actnbr__sort option[value="' + lp_changes[action].sort + '"]').attr("selected", "selected");
                    }
                    if ("ss" in lp_changes[action]) {
                        $(".list-hdr-srch__fld").val(lp_current.ss);
                        filterControls[action].queue.push({
                            "unitValue" : lp_changes[action].ss,
                            "unitLabel" : lp_changes[action].ss,
                            "groupName" : "localSearch",
                            "groupLabel" : "List Search"
                        });
                    }
                    if ("price" in lp_changes[action]) {
                        ;(function() {
                            var startInr = lp_changes[action].price.split(";")[0],
                                endInr = lp_changes[action].price.split(";")[1],
                                unitValue = lp_changes[action].price,
                                unitLabel = startInr.toLocaleString() + "-" + endInr.toLocaleString(),
                                minSlider, maxSlider;
                            
                            filterControls[action].queue.push({
                                "unitValue" : unitValue,
                                "unitLabel" : unitLabel,
                                "groupName" : 'price',
                                "groupLabel" : 'price'
                            });

                            // if price filter is to be added update slider values to new values
                            if (action === "add") {
                                lp_clipboard.slider.priceMin = startInr;
                                lp_clipboard.slider.priceMax = endInr;
                            // if price filter is to be removed update slider values to min and max values.
                            } else {
                                lp_clipboard.slider.priceMin = lp_defaults.priceMin;
                                lp_clipboard.slider.priceMax = lp_defaults.priceMax;
                            }
                        }());
                    }
                    if ("property" in lp_changes[action]) {
                        $.each(lp_changes[action].property, function (i, value) {
                            var $filterItem = $('.fltr-val__inpt[value="'+ value +'"]'),
                                unitValue = value,
                                unitLabel = $filterItem.attr("dispname"),
                                groupName = $filterItem.closest(".fltr").data("groupname"),
                                groupLabel = $.trim($filterItem.closest(".fltr").find(".fltr__ttl").text());

                            filterControls[action].queue.push({
                                "unitValue" : unitValue,
                                "unitLabel" : unitLabel,
                                "groupName" : groupName,
                                "groupLabel" : groupLabel
                            });
                        });
                    }
                });
                
                $.each(["add", "remove"], function (i, action) {
                    if (filterControls[action].queue.length) {
                        filterControls[action]();
                    }
                });
                
                $.extend(lp_clipboard, {
                    "prevMinPrice" : lp_current.price ? lp_current.price.split(";")[0] : lp_defaults.minPrice,
                    "prevMaxPrice" : lp_current.price ? lp_current.price.split(";")[1] : lp_defaults.maxPrice,
                    "prevLocalSearch" : lp_current.ss || ""
                });

                // after all changes reflected in the view re-initialize changes to empty.
                $.extend(lp_changes, { 
                    "add" : {},
                    "remove" : {}
                });
            }
        },
        "components" : {
            "appliedFilter" : {
                "group" : function(filterItem) {
                    return [
                        '<div class="js-fltrs-apld" data-groupname="' + filterItem.groupName + '">',
                            '<div class="js-fltrs-apld__lbl">' + filterItem.groupLabel + ':</div>',
                            this.unit(filterItem),
                        '</div>'
                    ].join("");
                },
                "unit" : function(filterItem) {
                    return [
                        '<div class="js-fltrs-apld__item" data-value="' + filterItem.unitValue + '">',
                            '<span class="js-fltrs-apld__item-label">' + filterItem.unitLabel + '</span>',
                            '<img class="js-fltrs-apld__item-cler" src="http://doypaxk1e2349.cloudfront.net/icons/cross-grey-small.png"/>',
                        '</div>'
                    ].join("");
                }
            }
        }
    },
    "services" : {
        "filterHash" : {
            "toParams" : function(filterHash) {
                var params = {},
                    prop_strings = filterHash.replace("#", "").split("&");

                if (prop_strings[0] !== "") {
                    $.each(prop_strings, function (i, prop_string) {
                        params[prop_string.split("=")[0]] = prop_string.split("=")[1];
                    });
                    
                    if ("property" in params) {
                        params.property = $.grep(params.property.split("|").sort(), function (e, i) {
                            return (e !== "");
                        });
                    }
                    
                    if (params.startinr !== params.priceMin || params.endinr !== params.priceMax) {
                        params.price = parseInt(params.startinr, 10) + ";" + parseInt(params.endinr, 10);
                    }

                    delete params.startinr;
                    delete params.endinr;
                }

                return params;
            },
            "fromParams" : function (params) {
                var filterHash = "#", index = 0;
                $.each(params, function (key) {
                    var value, prefix;
                    if (params[key]) {
                        prefix = index ? "&" : "";
                        if (key === "price") {
                            filterHash += prefix + "startinr=" + params[key].split(";")[0] + "&endinr=" + params[key].split(";")[1];
                        } else if (key === "property") {
                            filterHash += prefix + key + "=" + params[key].join("|");
                        } else {
                            filterHash += prefix + key + "=" + params[key];
                        }
                    }
                    index++;
                });
                return filterHash;
            }
        },
        "fetch" : {
            // generate query from all the new page state params
            "apiQuery" : function() {
                var lp_current = $.extend({}, ListPage.model.params.current),
                    lp_defaults = $.extend({}, ListPage.model.params.defaults),
                    lp_clipboard = ListPage.model.clipboard;

                return [
                    "subcategory=" + lp_current.subcategory,
                    lp_current.s ? ("&s=" + lp_current.s) : "",
                    lp_current.property ? ("&property=" + lp_current.property.join("|")) : "",
                    (lp_current.price) ? ("&startinr=" + lp_current.price.split(";")[0] + "&endinr=" + lp_current.price.split(";")[1]) : "",
                    lp_current.sort ? ("&sort=" + lp_current.sort) : "",
                    lp_current.ss ? ("&ss=" + lp_current.ss) : "",
                    lp_current.page ? ("&page=" + lp_current.page) : ""
                ].join("");
            },
            "productList" : function _productList() {
                var dfd = $.Deferred(),
                    lp_clipboard = ListPage.model.clipboard,
                    cache = _productList._cache_ = _productList._cache_ || { "queries" : [], "responses" : [] },
                    query = this.apiQuery(),
                    xhrPerf;
                
                // check if query in cache to load response from cache.
                if (cache.queries.indexOf(query) >= 0) {
                    setTimeout(($(".js-fltr-ldng-mask").show(), function() {
                        $(".js-fltr-ldng-mask").hide();
                    }), 350);
                    dfd.resolve(cache.responses[cache.queries.indexOf(query)]);
                    if (_gaq) _gaq.push(['_trackEvent', 'desktop_listpage_filter', 'xhrLoad', 'time', 0]);
                } else {
                    if (!lp_clipboard.isLoadParamsEqualtoPageParams) {
                        $(".js-fltr-ldng-mask").show();
                    }
                    xhrPerf = { start : +new Date() };
                    // abort pending XHR's for latest XHR to deal with rapid filter changes.
                    if (_productList.XHR) {
                        _productList.XHR.abort();
                    }
                    _productList.XHR = $.ajax({
                        url: "/msp/processes/property/api/msp_get_html_for_property_new.php?" + query,
                    }).done(function (response) {
                        xhrPerf.end = +new Date();
                        xhrPerf.time = (xhrPerf.end - xhrPerf.start)/1000;
                        // record xhrLoad Time to GA.
                        if (_gaq) _gaq.push(['_trackEvent', 'desktop_listpage_filter', 'xhrLoad', 'time', xhrPerf.time]);
                        dfd.resolve(response);
                        // cache query-response pair
                        cache.queries.push(query);
                        cache.responses.push(response);
                        // remove oldest entry if cache size exceeds 25
                        if (cache.queries.length > 25) {
                            cache.queries.shift();
                            cache.responses.shift();
                        }
                    }).always(function() {
                        $(".js-fltr-ldng-mask").hide();
                    });
                }
                if (_gaq) _gaq.push(['_trackEvent', 'finder', 'query', query]);

                return dfd.promise();
            },
            // hourly deals ajax loading
            "hourlyDeals" : function _hourlyDeals() {
                var query = this.apiQuery();

                if (_hourlyDeals.XHR) {
                    _hourlyDeals.XHR.abort();
                }

                _hourlyDeals.XHR = $.ajax({
                    "url": "/msp/autodeals/hourly_deals.php?" + query
                });

                return _hourlyDeals.XHR;
            }
        }
    }
};

var ProductList = {
    "initGrid" : function() {
        if(localStorage.getItem("gridType") === "large") {
            this.setGridType("large");
        } else if(localStorage.getItem("gridType") === "small") {
            this.setGridType("small");
        }
        $doc.on("click", ".js-list-hdr-view", function() {
            if($(this).hasClass("list-hdr-view__prdct-l")) {
                ProductList.setGridType("large");
            } else {
                ProductList.setGridType("small");
            }
        });
    },
    "setGridType" : function(type) {
        $(".list-hdr-view__prdct-l").removeClass("list-hdr-view__prdct-l--slctd");
        $(".list-hdr-view__prdct-s").removeClass("list-hdr-view__prdct-s--slctd");

        if(type==="large") {
            $(".prdct-grid").addClass("prdct-grid--prdct-l");
            $(".list-hdr-view__prdct-l").addClass("list-hdr-view__prdct-l--slctd");
            localStorage.setItem("gridType", "large");
        }
        else {
            $(".prdct-grid").removeClass("prdct-grid--prdct-l");
            $(".list-hdr-view__prdct-s").addClass("list-hdr-view__prdct-s--slctd"); 
            localStorage.setItem("gridType", "small");
        }
    }
};

(function ($) {
    $.QueryString = (function (a) {
        if (a === "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split("=");
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split("&"));
})(jQuery);

//For adding a cookie if utm_source is availble.
console.log($.QueryString['utm_source']);
if ($.QueryString["utm_source"]) {
    console.log($.QueryString['utm_source']);
    setCookie("utm_source", $.QueryString['utm_source']);
}

// // if category is mobile then first show mobile list and then show applied filters list.
// if ($("#mobilefilterwrapper").length) {
//  $.ajax({
//      url: "/msp/prop_filters/mobile-new.html"
//  }).done(function (response) {
//      var data = response.split("//&//#");
//      $("#mobilefilterwrapper").html(data[0]);
//      $(".listitems_rd").html(data[1]);
//      ListPage.controller.init();
//  });
// } else {
    ListPage.controller.init();
    ProductList.initGrid();
    
//}

// binding other links to filters.
// $(".js-prdct-list").on("click", "#viewallbestsellers", function() {
//  $("#showonlybestsellers").click();
// });

// search in filter groups.
$(".fltr-wrpr1").on("keyup", ".fltr-srch__fld", function() {
    var filterSearchQuery = $.trim($(this).val()),
        $filterGroup = $(this).closest(".fltr");
    if (filterSearchQuery === "") {
        $filterGroup.find(".fltr-val").show();
        $filterGroup.find(".fltr-srch__icon--srch").removeClass("fltr-srch__icon--hide");
        $filterGroup.find(".fltr-srch__icon--cler").addClass("fltr-srch__icon--hide");
        $filterGroup.find(".nano").nanoScroller();
    } else {
        $filterGroup.find(".fltr-val").hide();
        $filterGroup.find(".fltr-srch__icon--srch").addClass("fltr-srch__icon--hide");
        $filterGroup.find(".fltr-srch__icon--cler").removeClass("fltr-srch__icon--hide");
        $filterGroup.find(".fltr-val").filter(function() {
            var itemText = $.trim($(this).text()).toLowerCase(),
                index = itemText.indexOf(filterSearchQuery),
                result = false;
            if (index === 0) {
                result = true;
            } else if (index > 0) {
                if (itemText.toLowerCase().charAt(index - 1) === " ") {
                    result = true;
                }
            }
            return result;
        }).show();
        $filterGroup.find(".nano").nanoScroller();
    }
});

// clear search in filterGroups
$(".fltr-wrpr1").on("click", ".js-fltr-srch__cler", function() {
    var $filterGroup = $(this).closest(".fltr");
    $filterGroup.find(".fltr-srch__fld").val("");
    $filterGroup.find(".fltr-srch__icon").toggleClass("fltr-srch__icon--hide");
    $filterGroup.find(".fltr-val").show();
    $filterGroup.find(".nano").nanoScroller();
});