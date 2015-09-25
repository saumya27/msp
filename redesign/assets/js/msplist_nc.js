var userEmail,
    mspLoginStat,
    loginClassbackQueue,
    showScrollToTopDisplay,
    isLoaded = false,
    gProdId;

var ListPage = {
    "settings" : {
        "filterLength" : 5,
        "autoScrollLimit" : 2
    },
    "controller" : {
        "init" : function() {
            // get page params and default values to get default filters to be applied.
            ListPage.model.urlQuery = window.location.search.replace("?", "");
            ListPage.controller.getDefaults();
            var lp_changes = ListPage.model.params.changes,
                lp_defaults = ListPage.model.params.defaults,
                lp_current = ListPage.model.params.current,
                lp_page = ListPage.model.params.page,
                lp_filterPlugins = ListPage.controller.filterPlugins,
                lp_clipboard = ListPage.model.clipboard;
            
            ListPage.controller.updatePage();

            // Add listeners to all inputs for applying or removing filters
            (function addActionListeners() {
                var filterGroupQueue = [],
                    listenerTypes = [
                        ".filterBlock .filterItem.multi input",
                        ".filterBlock .filterItem.single input",
                    ];

                // globalSearch is comes from from urlQuery so no listener and assigned to localSearch field.

                // localSearch within the loaded product list
                $(".page-search input").on("keypress", function localSearch(e) {
                    if (e.which == 13) {
                        localSearch.query = $.trim($(this).val());
                        if (localSearch.query !== lp_clipboard.prevLocalSearch) {
                            if (localSearch.query !== "") {
                                lp_changes.add.ls = localSearch.query;
                                ga('send', 'event', 'filters', 'localsearch', localSearch.query);
                            } else {
                                lp_changes.remove.ls = lp_clipboard.prevLocalSearch;
                            }
                            ListPage.controller.updatePage();
                        }
                        return false;
                    }
                });

                // onclick a non-price multi value filter.
                $(".filterbar").on("click", ".filterBlock[data-groupname!='price'] .filterItem.multi input", function() {
                    var $filterItem = $(this),
                        groupName = $filterItem.closest(".filterBlock").data("groupname");
                    if (filterGroupQueue.length === 0) {
                        $.merge(filterGroupQueue, $filterItem);
                        ga('send', 'event', 'filters', groupName, $filterItem.val());
                    }
                    $.each(filterGroupQueue, function(i, item) {
                        var context = (!lp_current[groupName] || lp_current[groupName].indexOf($(item).attr("value")) === -1) ? "add" : "remove",
                            changes = lp_changes[context];
                        changes[groupName] = changes[groupName] || [];
                        changes[groupName].push($(item).val());
                    });
                    filterGroupQueue = [];
                    ListPage.controller.updatePage();
                });

                // onclick a non-price single value filter.
                $(".filterbar").on("click", ".filterBlock[data-groupname!='price'] .filterItem.single input", function() {
                    var $filterItem = $(this),
                        groupName = $filterItem.closest(".filterBlock").data("groupname");
                    if (filterGroupQueue.length === 0) {
                        $.merge(filterGroupQueue, $filterItem.closest(".filterItemCont").find("input:checked"));
                        ga('send', 'event', 'filters', groupName, $filterItem.val());
                    }
                    $.each(filterGroupQueue, function(i, item) {
                        var context = lp_current[groupName] !== $(item).attr("value") ? "add" : "remove",
                            changes = lp_changes[context];
                        changes = lp_changes[context];
                        changes[groupName] = $(item).val();
                    });
                    filterGroupQueue = [];
                    ListPage.controller.updatePage();
                });

                // onclick a price single value filter.
                $(".filterbar").on("click", ".filterBlock[data-groupname='price'] .filterItem.single input", function() {
                    var filterVal = $(this).val(),
                        values = filterVal.split(";"),
                        minPrice = parseInt(values[0], 10),
                        maxPrice = parseInt(values[1], 10),
                        context = lp_current.price !== $(this).attr("value") ? "add" : "remove",
                        displayPrices = {};
                    $.extend(lp_changes[context], {
                        "price" : filterVal
                    });

                    $('#priceSlider').slider('values', [
                        lp_filterPlugins.priceSlider.priceToRange(minPrice),
                        lp_filterPlugins.priceSlider.priceToRange(maxPrice)
                    ]);
                    $("#minPrice").val(minPrice);
                    $("#maxPrice").val(maxPrice);

                    ListPage.controller.updatePage();
                });

                // edit min and max price numbers in inputfiled
                $(".filterbar").on("change", "#minPrice, #maxPrice", function() {
                    var numRegEx = /^[0-9]+$/,
                        minPrice = $("#minPrice").val(),
                        maxPrice = $("#maxPrice").val(),
                        lp_clipboard = ListPage.model.clipboard;
                    if (numRegEx.test(minPrice) && numRegEx.test(maxPrice)) {
                        minPrice = parseInt(minPrice, 10);
                        maxPrice = parseInt(maxPrice, 10);
                        if (minPrice < maxPrice) {
                            if (minPrice < lp_defaults.price.min) {
                                minPrice = lp_defaults.price.min;
                                $("#minPrice").val(minPrice);
                            }
                            if (maxPrice > lp_defaults.price.max) {
                                maxPrice = lp_defaults.price.max;
                                $("#maxPrice").val(maxPrice);
                            }
                            if (minPrice !== lp_defaults.price.min || maxPrice !== lp_defaults.price.max) {
                                // if new price range is subset of total range then apply filter
                                $.extend(lp_changes.add, {
                                    "price" : minPrice + ";" + maxPrice
                                });
                            } else {
                                // if new price range is total range then remove existing price filter.
                                $.extend(lp_changes.remove, {
                                    "price" : lp_clipboard.prevMinPrice + ";" + lp_clipboard.prevMaxPrice
                                });
                            }
                            ListPage.controller.updatePage();
                            return;
                        }
                    }
                    $("#minPrice").val(lp_clipboard.prevMinPrice);
                    $("#maxPrice").val(lp_clipboard.prevMaxPrice);
                });

                // reset all apllied filters in a filtergroup
                $(".filterbar").on("click", ".filterReset", function() {
                    var $currentGroup = $(this).closest(".filterBlock"),
                        groupName = $currentGroup.data('groupname'),
                        $activeFilters = $currentGroup.find(".filterItemCont input:checked");
                    if (groupName == "price") {
                        lp_changes.remove.price = lp_clipboard.prevMinPrice + ";" + lp_clipboard.prevMaxPrice;
                        ListPage.controller.updatePage();
                    } else if (groupName == "recent") {
                        lp_changes.remove.recent = "on";
                        ListPage.controller.updatePage();
                    } else {
                        $.merge(filterGroupQueue, $activeFilters);
                        $.each(listenerTypes, function(i, selector) {
                            if ($currentGroup.find(".filterItem input").eq(0).is(selector)) {
                                $activeFilters.eq(0).click();
                                return;
                            }
                        });
                    }
                    ga('send', 'event', 'filters', 'Reset', groupName);
                    return false;
                });

                (function removeAppliedFilters() {
                    var appliedFilterQueue = [];

                    function readChanges() {
                        // batch changes(DOM write operatations ie. to uncheck filters/remove tags) to trigger only one render operation.
                        $.each(appliedFilterQueue, function(i, filter) {
                            var filterVal = $(filter).attr('data-value'),
                                groupname = $(filter).attr('data-groupname'),
                                $filterItem = $('.filterBlock[data-groupname="' + groupname + '"] .filterItem');
                            if ($filterItem.hasClass("multi")) {
                                lp_changes.remove[groupname] = lp_changes.remove[groupname] || [];
                                lp_changes.remove[groupname].push(filterVal);
                            } else {
                                lp_changes.remove[groupname] = filterVal;
                            }
                        });
                        appliedFilterQueue = [];
                    }

                    // remove applied filter by clicking tags shown above product list.
                    $(".selected-filters-wrapper").on("click", ".filterAppliedItem", function removeTag() {
                        var filterVal, $filterItem, minPrice, maxPrice;
                        $.merge(appliedFilterQueue, $(this));
                        readChanges();
                        ListPage.controller.updatePage();
                    });

                    $(".selected-filters-wrapper").on("click", ".filterResetAll", function(event) {
                        $.merge(appliedFilterQueue, $('.filterAppliedItem'));
                        readChanges();
                        ListPage.controller.updatePage();
                        ga('send', 'event', 'filters', 'ResetAll');
                    });
                }());

                // sorting options.
                $('select[name="sortby"]').on("change", function() {
                    var sortVal = $(this).val();
                    if (sortVal) {
                        lp_changes.add.sortby = sortVal;    
                    } else {
                        lp_changes.remove.sortby = lp_clipboard.prevSortBy;
                    }
                    ListPage.controller.updatePage();
                    ga('send', 'event', 'filters', 'sort', $(this).val());
                });

                // Auto Load products on scroll upto some limit.
                $(window).on("scroll.fashionAutoLoadProductList", function(e) {
                    var $docheight = $(document).height();
                    if ($docheight - $(e.target).scrollTop() < 1800) {
                        if (lp_clipboard.scroll.isEnabled && !lp_clipboard.scroll.isLoading) {
                            if (lp_clipboard.scroll.isAutoLoad) {
                                lp_clipboard.scroll.counter++;
                                lp_clipboard.scroll.isTrigger = true;
                                ListPage.controller.updatePage();
                            }
                        }
                    }
                });
                
                $(document).on('click', '.load-more-button', function() {
                    lp_clipboard.scroll.isTrigger = true;
                    lp_clipboard.scroll.counter++;
                    ListPage.controller.updatePage();
                });
            
            }());
                
            // change filter params according to the the new history entry/
            window.onpopstate = function(e) {
                var oldUrlParams, newUrlParams, isParamsChanged = false;
                oldUrlParams = ListPage.services.filterQuery.toParams(ListPage.model.urlQuery);
                newUrlParams = ListPage.services.filterQuery.toParams(window.location.search);
                
                $.extend(lp_changes.add, (function getNewlyAddedParams() {
                    // see extra params in new url compared to old url (loop over newurl).
                    var result = {}; 
                    $.each(newUrlParams, function(key, paramVal) {
                        if (oldUrlParams[key] && oldUrlParams[key] !== paramVal) {
                            result[key] = paramVal;
                            isParamsChanged = true;
                        }
                    });
                    return result;
                })());
                $.extend(lp_changes.remove,  (function getRemovedParams() {
                    // see missing params in new url compared to old url (loop over oldurl).
                    var result = {};
                    $.each(oldUrlParams, function(paramKey, paramVal) {
                        if(!(paramKey in newUrlParams)) {
                            result[paramKey] = paramVal;
                            isParamsChanged = true;
                        }
                    });
                    return result;
                })());
                
                if (isParamsChanged) {
                    ListPage.controller.updatePage();   
                }
            };
        },
        // get default filters to be applied on SEO pages.
        "getDefaults" : function() {
            var lp_defaults = ListPage.model.params.defaults,
                lp_clipboard = ListPage.model.clipboard,
                pageUrlQuery = $(".list-header").attr("data-page-default"),
                pageParams = ListPage.services.filterQuery.toParams(pageUrlQuery);
            $.extend(ListPage.model.params.page, pageParams);
            if (!$.isEmptyObject(pageParams)) {
                lp_clipboard.isSeoPage = true;
            }
        },
        "filterPlugins" : {
            "init" : function(minPrice, maxPrice) {
                var minSlider = minPrice ? this.priceSlider.priceToRange(minPrice) : 0,
                    maxSlider = maxPrice ? this.priceSlider.priceToRange(maxPrice) : 200,
                    lp_changes = ListPage.model.params.changes,
                    lp_defaults = ListPage.model.params.defaults,
                    lp_clipboard = ListPage.model.clipboard;
                lp_filterPlugins = ListPage.controller.filterPlugins;
                
                // init nano scrollbar for all filterblocks
                ListPage.controller.filterPlugins.nanoScrollbarInit();
                
                // init price slider with the price params 
                $("#priceSlider").slider({
                    "range" : true,
                    "min" : 0,
                    "max" : 200,
                    "values" : [minSlider || 0, maxSlider || 200],
                    "step" : 1,
                    // animate: true,
                    "slide" : ListPage.controller.filterPlugins.priceSlider.callback,
                    "stop" : function(a, b) {
                        var priceVal;
                        if (b.values[0] == 0 && b.values[1] == 200) {
                            // if range is equal to total range then remove price filter
                            lp_changes.remove.price = lp_clipboard.prevMinPrice + ";" + lp_clipboard.prevMaxPrice;
                        } else {
                            // if range is not equal to total range then add new price filter
                            lp_changes.add.price = lp_filterPlugins.priceSlider.rangeToPrice(b.values[0]) + ";" + lp_filterPlugins.priceSlider.rangeToPrice(b.values[1]);
                        }
                        $('#priceSlider').slider('values', [b.values[0], b.values[1]]);
                        ListPage.controller.updatePage();
                    }
                });
                if (minPrice || maxPrice) {
                    $("#minPrice").val(minPrice || lp_defaults.price.min);
                    $("#maxPrice").val(maxPrice || lp_defaults.price.max);
                }
            },
            "priceSlider" : {
                // get price value from slider range value
                "rangeToPrice" : function(sliderValue) {
                    var priceMin = ListPage.model.params.defaults.price.min,
                        priceMax = ListPage.model.params.defaults.price.max,
                        priceValue = Math.ceil(Math.ceil(priceMax / 50) * ((Math.exp(2.7725 * (sliderValue / 200)) - 1) / 15)) * 50;

                    if (sliderValue === 0 || priceValue < 0)
                        return 0;
                    else if (sliderValue == 200 || priceValue > priceMax)
                        return priceMax;
                    else
                        return priceValue;
                },
                // get slider range from price value
                "priceToRange" : function(price) {
                    var result = (function binarySearch(a, fn, min, max) {
                        binarySearch.old = binarySearch.current;
                        binarySearch.current = Math.floor((min + max) / 2);
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
                        return binarySearch(a, fn, min, max);
                    }(Number(price), ListPage.controller.filterPlugins.priceSlider.rangeToPrice, 0, 200));
                    return result;
                },
                // run this function while sliding the price slider.
                "callback" : function(a, b) {
                    var minPrice, maxPrice;
                    if ((b.values[0] + 1) >= b.values[1]) {
                        return false;
                    }
                    minPrice = ListPage.controller.filterPlugins.priceSlider.rangeToPrice(b.values[0]);
                    maxPrice = ListPage.controller.filterPlugins.priceSlider.rangeToPrice(b.values[1]);
                    $("#minPrice").val(minPrice);
                    $("#maxPrice").val(maxPrice);
                },
            },
            // init nanoscrollbar plugin to get overflow scroll to filterGroups
            "nanoScrollbarInit" : function() {
                $('.filterbox .nano').each(function() {
                    var totalHeight,
                        maxLength = ListPage.settings.filterLength,
                        $filterItem = $(this).find('.filterItem'),
                        $nano = $(this);
                    filterItemHeight = $filterItem.height();
                    if ($filterItem.length <= ListPage.settings.filterLength) {
                        totalHeight = 0;
                        $filterItem.each(function() {
                            totalHeight += $(this).outerHeight();
                        });
                        if (totalHeight < 100) {
                            $nano.closest(".filterBlock").find(".filterSearchCont").hide();
                            $nano.closest('.filterItemCont').css('height', totalHeight + 'px');
                        } else {
                            $nano.closest('.filterItemCont').css('height', maxLength * filterItemHeight + 'px');
                        }
                    } else {
                        $nano.closest(".filterItemCont").css("height", maxLength * filterItemHeight + "px");
                    }
                });
                $('.nano').nanoScroller({
                    "alwaysVisible" : true
                });
            }
        },
        // once changes are update the page state before rendering the view.
        "updatePage" : function() {
            var lp_current = ListPage.model.params.current,
                lp_changes = ListPage.model.params.changes,
                lp_defaults = ListPage.model.params.defaults,
                lp_page = ListPage.model.params.page,
                lp_clipboard = ListPage.model.clipboard,
                lp_services = ListPage.services,
                prop_strings;

            // if filters are changed then reset scroll params
            if (!lp_clipboard.scroll.isTrigger) {
                $.extend(lp_clipboard.scroll, {
                    "counter" : 0,
                    "isAutoLoad" : true,
                    "isEnabled" : true
                });
            }

            if (!lp_clipboard.isOnLoad) {
                // apply additions in current state params
                $.each(lp_changes.add, function(paramName, paramValue) {
                    if ($.isArray(paramValue)) {
                        if (!$.isArray(lp_current[paramName])) {
                            lp_current[paramName] = lp_current[paramName] ? [lp_current[paramName]] : [];
                        }
                        $.merge(lp_current[paramName], paramValue);
                    } else {
                        lp_current[paramName] = paramValue;
                    }
                });
                // apply deletions in current state params
                $.each(lp_changes.remove, function(paramKey, paramValSet) {
                    if ($.isArray(paramValSet) && $.isArray(lp_current[paramKey])) {
                        $.each(paramValSet, function(i, paramValue) {
                            var index = lp_current[paramKey].indexOf(paramValue);
                            lp_current[paramKey].splice(index, 1);
                        });
                        if (lp_current[paramKey].length === 0) {
                            delete lp_current[paramKey];
                        }
                    } else {
                        delete lp_current[paramKey];
                    }
                });
            } else {
                // if isOnLoad get current params from url query.
                $.extend(lp_current, lp_services.filterQuery.toParams(window.location.search));

                (function importPageParamsIfurlQueryParamsEmpty() {
                    var currentLength = 0;
                    $.each(lp_current, function() {
                        currentLength++;
                    });
                    if (currentLength === 0) {
                        $.each(lp_page, function(param, pageParamValue) {
                            if ($.isArray(pageParamValue)) {
                                // initialize array if property is not defined
                                lp_current[param] = $.isArray(lp_current[param]) ? lp_current[param] : [];
                                $.each(pageParamValue, function(i, prop) {
                                    if (lp_current[param].indexOf(prop) === -1) {
                                        lp_current[param].push(prop);
                                    }
                                });
                            } else {
                                lp_current[param] = pageParamValue;
                            }
                        });
                        // disabled until quicklinks go live
                        // delete lp_current.ql;
                    }

                    if (lp_services.filterQuery.fromParams(lp_current) === lp_services.filterQuery.fromParams(lp_page)) {
                        lp_clipboard.isLoadParamsEqualToDefaultParams = true;
                    }

                    //since every registered params on current is new add them to changes also.
                    $.each(lp_current, function(key) {
                        lp_changes.add[key] = lp_current[key];
                    });
                })();
            }

            //generate new urlQuery, and start view rendering.
            lp_services.filterQuery.fromParams(lp_current, true);
            ListPage.view.render();

        }
    },
    "model" : {
        "urlQuery" : "",
        "filterQuery" : "",
        "params" : {
            "current" : {},
            "changes" : {
                "add" : {},
                "remove" : {},
            },
            "page" : {},
            "defaults" : {
                "price" : {}
            }
        },
        // mode of tranferring values from one component(M, V, C) to another.
        "clipboard" : {
            "prevMinPrice" : "",
            "prevMaxPrice" : "",
            "slider" : {},
            "scroll" : {
                "isAutoLoad" : true,
                "isEnabled" : true,
                "counter" : 0,
                "isloading" : false,
                "isTrigger" : false
            },
            "isOnLoad" : true,
            "isSeoPage" : false,
            "isLoadParamsEqualToDefaultParams" : false
        }
    },
    "view" : {
        "render" : function(response) {
            var lp_current = ListPage.model.params.current,
                lp_changes = ListPage.model.params.changes,
                lp_page = ListPage.model.params.page,
                lp_defaults = ListPage.model.params.defaults,
                lp_clipboard = ListPage.model.clipboard,
                lp_filterPlugins = ListPage.controller.filterPlugins,
                filterControls, xhrPerf, builtQueryString;

            // build query string with latest params and update url.
            builtQueryString = ListPage.services.buildUrlQuery();
            ListPage.services.handlePushState(window.location.pathname + (builtQueryString ? "?" : "") + builtQueryString);

            if (!(lp_clipboard.isOnLoad && lp_clipboard.isSeoPage)) {
                if (lp_clipboard.scroll.isTrigger) {
                    $('.the-grid').append('<div class="pagination-loading-icon">Loading</div>');
                } else {
                    $('.the-grid').append('<div class="filter-loading-icon">Loading</div>');
                }
            }

            xhrPerf = { "start" : +new Date() };
            lp_clipboard.scroll.isLoading = true;
            if (lp_clipboard.scroll.isTrigger) {
                $('.the-grid').find('.load-more-button').remove();
            }
            ListPage.view.requestData().done(function(response) {
                var loadingDelay;
                xhrPerf.end = +new Date();
                xhrPerf.time = (xhrPerf.end - xhrPerf.start) / 1000;
                loadingDelay = (xhrPerf.time < 0.1) ? 500 : 0;
                setTimeout(function() {
                    updateHTML(response);
                    lp_filterPlugins.init(lp_clipboard.slider.priceMin, lp_clipboard.slider.priceMax);
                    applyChangesAfterLoad();
                }, loadingDelay);
                if (loadingDelay && _gaq) _gaq.push(['_trackEvent', 'desktop_fashion_listpage_filter', 'xhrLoad', 'time', xhrPerf.time]);

                lp_clipboard.scroll.isLoading = false;
            });

            function updateHTML(response) {
                var freshData, gridSuffix,
                    $grid = $('.the-grid');
                if (lp_clipboard.scroll.isTrigger) {
                    $grid.find('.pagination-loading-icon').remove();
                } else {
                    $grid.find('.filter-loading-icon').remove();
                }
                freshData = response.split("//&//#");

                // if no products are loaded in the latest ajax then disable load more.
                if (!($grid.length === 1 && $(freshData[0]).filter('.grid-item').length !== 0)) {
                    lp_clipboard.scroll.isEnabled = false;
                    lp_clipboard.scroll.isTrigger = false;
                    return false;
                }

                // If onload params of a SEO page match the default page params then dont load content.
                if (!(lp_clipboard.isOnLoad && lp_clipboard.isSeoPage && lp_clipboard.isLoadParamsEqualToDefaultParams)) {

                    // load new filterbox
                    $(".filterbar").html(freshData[1]);

                    // load new product list
                    gridSuffix = '<br clear="all"/>';
                    if (lp_clipboard.scroll.isTrigger) {
                        $grid.find('br').remove();
                        // scrolled more than limit disable autoload and add load more button.
                        if (lp_clipboard.scroll.counter >= ListPage.settings.autoScrollLimit) {
                            lp_clipboard.scroll.isAutoLoad = false;
                            gridSuffix += '<div class="btn btn-xl btn-block load-more-button">Load More Products</div>';
                        }
                        $grid.append(freshData[0] + gridSuffix);
                        lp_clipboard.scroll.isTrigger = false;
                    } else {
                        $grid.html(freshData[0] + gridSuffix);
                    }
                    // update product count data  above product list
                    $(".the-grid-header .num-products").text($(".filterbox .num_products").data('val'));
                    $(".the-grid-header .num-stores").text($(".filterbox .num_stores").data('val'));
                    $(".filterbox .num_products, .filterbox .num_stores").remove();
                } else if (lp_clipboard.isOnLoad) {
                    // still filter box is not there in onload code of seo pages so fetching it.
                    $grid.find('.load-more-button').remove();
                    $(".filterbar").html(freshData[1]);
                    $(".the-grid-header .num-products").text($(".filterbox .num_products").data('val'));
                    $(".the-grid-header .num-stores").text($(".filterbox .num_stores").data('val'));
                    $(".filterbox .num_products, .filterbox .num_stores").remove();
                }

                // after running onLoad callstack, then change flag's value to false
                if (lp_clipboard.isOnLoad) {
                    lp_clipboard.isOnLoad = false;
                }

                return true;
            }

            function applyChangesAfterLoad() {

                (function getRequiredValues() {
                    var priceMin, priceMax;
                    if (!(lp_defaults.price.min || lp_defaults.price.max)) {
                        lp_defaults.price.min = parseInt($('#minPrice').data('minprice'), 10);
                        lp_defaults.price.max = parseInt($('#maxPrice').data('maxprice'), 10);
                    }

                    if (lp_current.price) {
                        priceMin = parseInt(lp_current.price.split(";")[0], 10);
                        priceMax = parseInt(lp_current.price.split(";")[1], 10);
                    } else {
                        priceMin = lp_defaults.price.min;
                        priceMax = lp_defaults.price.max;
                    }
                    $.extend(lp_clipboard, {
                        "prevMinPrice" : priceMax,
                        "prevMaxPrice" : priceMax,
                        "prevLocalSearch" : lp_current.ls || "",
                        "prevSortBy" : lp_current.sortby || ""
                    });
                }());

                // operations to be done to add/remove filters.
                $.each(lp_current, function(paramName, paramValue) {
                    var groupname = paramName,
                        $filterGroupOptions = $('.filterBlock[data-groupname="' + groupname + '"] .filterItemCont input[name="' + groupname + '"]');
                    if ($.isArray(paramValue) && groupname !== "recent") {
                        $.each(paramValue, function(i, value) {
                            $filterGroupOptions.filter("input[value='" + value + "']").attr("checked", true);
                        });
                    } else {
                        if (groupname === "recent") {
                            $filterGroupOptions.attr("checked", true);
                        } else {
                            $filterGroupOptions.filter("[value='" + paramValue + "']").attr("checked", true);
                        }
                    }
                    $('.filterBlock[data-groupname='+ groupname + ']').find(".filterReset").show();
                });

                filterControls = {
                    "add" : function() {
                        var allTagsHtml = "",
                            $filterGroupOptions;

                        // apply all filters registered on filterControls.add.queue
                        $.each(filterControls.add.queue, function(i, listItem) {
                            // batch html of all the filters to append all filter tags in one go.
                            allTagsHtml += [
                                '<span class="filterAppliedItem" data-value="' + listItem.value + '" data-groupname="' + listItem.groupname + '">',
                                    '<img src="/images/search_clear.png" class="filterAppliedClear">&nbsp;',
                                    listItem.label,
                                '</span>'
                            ].join("");
                            
                            $filterGroupOptions = $('.filterBlock[data-groupname="' + listItem.groupname + '"] .filterItemCont input[name="' + listItem.groupname + '"]');
                            if ($filterGroupOptions.closest(".filterItem").is(".single") || ['ls', 'sortby'].indexOf(listItem.groupname) !== -1) {
                                $('.filterAppliedItem[data-groupname="' + listItem.groupname + '"]').remove();
                            }
                            
                            if (listItem.groupname === 'price') {
                                // update priceSlider range points
                                $('#priceSlider').slider('values', [
                                    lp_filterPlugins.priceSlider.priceToRange(listItem.value.split(";")[0]),
                                    lp_filterPlugins.priceSlider.priceToRange(listItem.value.split(";")[1])
                                ]);
                                $("#minPrice").val(listItem.value.split(";")[0]);
                                $("#maxPrice").val(listItem.value.split(";")[1]);
                            } else if (listItem.groupname === 'sortby') {
                                $('.sortby-wrap option[value="' + listItem.value + '"]').attr('selected', 'selected');
                            } else if (listItem.groupname === "ls") {
                                $('.page-search input').val(lp_current.ls);
                            }
                        });
                        if (allTagsHtml !== "" && $(".selectedFilters .filterResetAll").length === 0) {
                            allTagsHtml += '<span class="filterResetAll resetFiltersOutside">Reset All</span>';
                        }
                        $('.selectedFilters').append(allTagsHtml);
                        $('.selected-filters-wrapper').show();
                    },
                    "remove" : function() {
                        // remove all filters registered on filterControls.remove.queue
                        $.each(filterControls.remove.queue, function(i, listItem) {
                            var $filterOption = $(".filterBlock .filterItemCont input[value='" + listItem.value + "']");
                            $filterOption.attr("checked", false);
                            $(".filterAppliedItem[data-value='" + listItem.value + "'][data-groupname='" + listItem.groupname + "']").remove();
                            if (listItem.groupname == 'price') {
                                // update priceSlider range points
                                $('#priceSlider').slider('values', [0, 200]);
                                $("#minPrice").val(lp_defaults.price.min);
                                $("#maxPrice").val(lp_defaults.price.max);
                            } else if (listItem.groupname === "sortby") {
                                $('.sortby-wrap option[value=""]').attr('selected', 'selected');
                            } else if (listItem.groupname === "ls") {
                                $('.page-search input').val(lp_current.ls);
                            }
                        });

                        // if all filter tags removed remove "clear all" filter tag also
                        if ($('.filterAppliedItem').length == 0) {
                            $('.filterResetAll').remove();
                            $('.selected-filters-wrapper').hide();
                        }
                    }
                };

                // after all filters added/removed reinitialize queue to empty.
                filterControls.add.queue = [];
                filterControls.remove.queue = [];

                // register all filter changes to filterControls queue to batch applying and removing operations.
                $.each(["add", "remove"], function(i, action) {
                    $.each(lp_changes[action], function(paramName, paramValue) {
                        if (paramName === "recent") {
                            filterControls[action].queue.push({
                                "value" : lp_changes[action].recent,
                                "label" : "New Arrivals",
                                "groupname" : paramName
                            });
                        } else if (paramName === "sortby") {
                            filterControls[action].queue.push({
                                "value" : lp_changes[action].sortby,
                                "label" : $('.sortby-wrap option[value="' + lp_changes[action].sortby + '"]').text(),
                                "groupname" : paramName
                            });
                        } else if (paramName === "ls") {
                            filterControls[action].queue.push({
                                "value" : lp_changes[action].ls,
                                "label" : lp_changes[action].ls,
                                "groupname" : paramName
                            });
                        } else if (paramName === "price") {
                            (function() {
                                var value, label, groupname, minSlider, maxSlider;
                                value = lp_changes[action].price;
                                label = "&#8377; " + value.split(";")[0] + " - &#8377; " + +value.split(";")[1];
                                groupname = 'price';
                                filterControls[action].queue.push({
                                    "value" : value,
                                    "label" : label,
                                    "groupname" : paramName,
                                });
                                
                                lp_clipboard.slider.priceMin = (action === "add") ? value.split(";")[0] : lp_defaults.price.min;
                                lp_clipboard.slider.priceMax = (action === "add") ? value.split(";")[1] : lp_defaults.price.max;

                            }());
                        } else {
                            (function(){
                                var paramValues = $.isArray(paramValue) ? paramValue : [paramValue];
                                $.each(paramValues, function(i, value) {
                                    var label = $(".filterBlock .filterItemCont input[value='" + value + "']").closest(".filterItem").find(".filterVal").text();
                                    if (paramName === "discount") {
                                        if (value.split(";")[1] == "100") {
                                            label = value.split(";")[0] + "% and above";
                                        } else {
                                            label = value.split(";")[0] + "% to " + value.split(";")[1] + "%";
                                        }
                                    }
                                    filterControls[action].queue.push({
                                        "value" : value,
                                        "label" : label,
                                        "groupname" : paramName
                                    });
                                });
                            }());
                        }
                    });
                });

                $.each(["add", "remove"], function(i, action) {
                    if (filterControls[action].queue.length) {
                        filterControls[action]();
                    }
                });

                // after all changes reflected in the view re-initialize changes to empty.
                $.extend(lp_changes, {
                    "add" : {},
                    "remove" : {}
                });
            }
        },
        "requestData" : function() {
            var cache = this.requestData._cache_ = this.requestData._cache_ || {
                    "queries" : [],
                    "responses" : []
                },
                lp_current = $.extend({}, ListPage.model.params.current),
                lp_filterPlugins = ListPage.controller.filterPlugins,
                lp_defaults = $.extend({}, ListPage.model.params.defaults),
                lp_clipboard = ListPage.model.clipboard,
                query, ajaxData, ajaxCacheKey,
                dfd = $.Deferred();

            // generate query from all the new page state params
            (function buildAjaxData() {
                var prevProductCount;
                query = "filter/";
                ajaxData = {};
                $.each(lp_current, function(key, value) {
                    var qValue;
                    if (["recent", "sortby", "ls", "page"].indexOf(key) === -1) {
                        if ($.isArray(value)) {
                            qValue = (["price", "discount"].indexOf(key) !== -1) ? value.join(";") : value.join(",");
                            query += key + ":" + qValue + "/";
                        } else {
                            query += key + ":" + value + "/";
                        }
                    }
                });
                ajaxData.recent = ("recent" in lp_current) ? 1 : 0;
                $.extend(ajaxData, {
                    "q" : query,
                    "subcategory" : $('.tags').attr('data-subcategory'),
                    "s" : lp_current.ls,
                    "sortby" : lp_current.sortby,
                    "start" : lp_clipboard.scroll.counter * 21,
                    "rows" : 21
                });
                ajaxCacheKey = JSON.stringify(ajaxData);
            })();

            // check if query in cache to load response from cache.
            if (cache.queries.indexOf(ajaxCacheKey) >= 0) {
                dfd.resolve(cache.responses[cache.queries.indexOf(ajaxCacheKey)]);
            } else {
                // abort pending XHR's for latest XHR to deal with rapid filter changes.
                if (ListPage.view.requestData.XHR) {
                    ListPage.view.requestData.XHR.abort();
                }
                ListPage.view.requestData.XHR = $.ajax({
                    "url" : "http://www.mysmartprice.com/fashion/filters/filter_get_revamp",
                    "data" : ajaxData,
                    "type" : "GET"
                }).done(function(response) {
                    dfd.resolve(response);
                    // cache query-response pair
                    cache.queries.push(ajaxCacheKey);
                    cache.responses.push(response);
                    // remove oldest entry if cache size exceeds 25
                    if (cache.queries.length > 25) {
                        cache.queries.shift();
                        cache.responses.shift();
                    }
                });
            }
            if (_gaq) _gaq.push(['_trackEvent', 'finder', 'query', query]);
            return dfd.promise();
        }
    },
    "services" : {
        "buildUrlQuery" : function() {
            var oldUrlQuery, newUrlQuery;
            
            oldUrlQuery = ListPage.model.urlQuery;
            newUrlQuery = (function getNewUrlQuery(){
                var oldQueryParams = {}, newQueryParams;
                $.each(oldUrlQuery.split("&"), function(key, value) {
                    var paramKey = value.split("=")[0],
                        paramVal = value.split("=")[1];
                    oldQueryParams[paramKey] = paramVal;
                });
                newQueryParams = $.extend({}, oldQueryParams, {
                    "filter" : ListPage.model.filterQuery
                });
                
                getNewUrlQuery.result = (function(){
                    var result = "";
                    $.each(newQueryParams, function(key, value) {
                        if(value) {
                            result += key + "=" + value + "&";
                        }
                    });
                    result = result.slice(0, -1);
                    return result; 
                }());
                
                return getNewUrlQuery.result;
            }());
            
            ListPage.model.urlQuery = newUrlQuery;
            return newUrlQuery;
        },
        "filterQuery" : {
            "fromParams" : function(params, shouldUpdateModel) {
                var filterQuery = "",
                    suffix = "/",
                    index = 0;
                $.each(params, function(key, param) {
                    var value, prefix;
                    if (param) {
                        if ($.isArray(param)) {
                            if (key == "price" || key == "price") {
                                value = param.join(";");
                            } else {
                                value = param.join(",");
                            }
                        } else {
                            value = param;
                        }
                        filterQuery += key + ":" + value + suffix;
                    }
                    index++;
                });
                if (shouldUpdateModel) {
                    ListPage.model.filterQuery = filterQuery;
                    ListPage.services.buildUrlQuery();
                }
                return filterQuery;
            },
            "toParams" : function(urlQuery) {
                var urlQueryParams = {},
                    prop_strings,
                    lp_defaults = ListPage.model.params.defaults,
                    urlQuery = decodeURIComponent(urlQuery) || "";
                
                prop_strings = (function(){
                    var urlQueryParams = urlQuery.replace("?", "").split("&"),
                        filterQueryValue = "",
                        _prop_strings;
                    $.each(urlQueryParams, function(key, value){
                        if (value.indexOf("filter=") !== -1) {
                            filterQueryValue = value.split("=")[1];
                        }
                    });
                    _prop_strings = $.grep(filterQueryValue.split('/'), function(e, i) {
                        return (e !== "");
                    });
                    return _prop_strings;
                }());
                
                if (prop_strings.length) {
                    $.each(prop_strings, function(i, prop_string) {
                        var prop_name = decodeURIComponent(prop_string.split(":")[0]),
                            prop_value = decodeURIComponent(prop_string.split(":")[1]);
                        prop_value = $.grep(prop_value.split(","), function(e, i) {
                            return (e !== "");
                        });
                        prop_value = prop_value.length > 1 ? prop_value : prop_value[0];
                        urlQueryParams[prop_name] = prop_value;
                    });
                    if ("price" in urlQueryParams) {
                        if (parseInt(urlQueryParams.price.split(";")[0], 10) === lp_defaults.price.min && parseInt(urlQueryParams.price.split(";")[1], 10) === lp_defaults.price.max) {
                            delete urlQueryParams.price;
                        }
                    }
                }
                return urlQueryParams;
            }
        },
        // disabled until mobile redirection goes live
        "handlePushState" : function (url) {
            try {
                window.history.pushState({
                    "url" : url
                }, url, url);
                return;
            } catch (e) {
                window.location.href = url;
                return;
            }
        }
    }
};

function isSingle(url) {
    url = url || window.location.href;
    if (url.indexOf("products/") > 0) {
        return true;
    } else {
        return false;
    }
}

if (!isSingle() && $(".the-grid").length) {
    ListPage.controller.init();
}

//if (isSingle()) {
    var mainImgSrc = $(".singlePageImage img").attr("src");
    $(".singlePageImageThumb").on("mouseenter", function(e) {
        var bgImage, newSrc;
        if ($(this).is(".singlePageImage")) return;
        bgImage = $(this).css("background-image");
        newSrc = bgImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        $(".singlePageImage img").attr("src", newSrc);
    })
    $(document).on("mouseleave", ".singlePageImageThumbs-wrap", function(e) {
        console.log($(this).hasClass("singlePageImageThumbs-wrap"));
        $(".singlePageImage img").attr("src", mainImgSrc);
    });
$(document).on("click", ".singlePageImageThumb", function() {
    var gridid = $(".gridItemSingle").data("gridid"),
        thumbid = $(this).data("seq-id");
    openPopup("/fashion/single/zoomed_multi_image_popup?gridid=" + gridid + "&thumbid=" + thumbid);
});
//}

$("body").on("click", ".filterTitle", function() {
    var filterBody = $(this).closest(".filterBlock").find(".filterBody");
    if (filterBody.closest(".filterBlock").hasClass("min")) {
        $(this).closest(".filterBlock").removeClass("collapsed min");
        filterBody.slideDown();
    } else {
        filterBody.closest(".filterBlock").addClass("min");
        filterBody.slideUp(function() {
            $(this).closest(".filterBlock").addClass("collapsed");
        });
    }
});

// search in filter groups.
$(".filterbar").on("keyup", ".filterSearch", function() {
    var filterSearchQuery = $.trim($(this).val()),
        $filterBlock = $(this).closest(".filterBlock");
    if (filterSearchQuery === "") {
        $filterBlock.find(".filterItem").show();
        $filterBlock.find(".searchClear").hide();
        $filterBlock.find(".nano").nanoScroller();
    } else {
        $filterBlock.find(".filterItem").hide();
        $filterBlock.find(".searchClear").show();
        $filterBlock.find(".filterItem").filter(function() {
            var itemText = $.trim($(this).find(".filterVal").text()).toLowerCase(),
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
        $filterBlock.find(".nano").nanoScroller();
    }
});

// clear search in filterGroups
$(".filterbar").on("click", ".searchClear", function() {
    var $filterGroup = $(this).closest(".filterBlock");
    $(this).closest(".filterSearchCont").find(".filterSearch").val("");
    $(this).hide();
    $filterGroup.find(".filterItem").show();
    $filterGroup.find(".searchClear").hide();
    $filterGroup.find(".nano").nanoScroller();
});

$(window).on("scroll", function() {
    showScrollToTop(this);
});

$(document).ready(function(){
    scrollToTopInit();
    setTimeout(function(){
        if (!getCookie('autoPopup')) {
            var popupUrl = $('[data-autopopup]').data('autopopup');
            openPopup(popupUrl);
            setCookie('autoPopup', '1', 1);
        }
    }, 3000);

    // For internal analytics
    log_data("pageView");
});

function scrollToTopInit() {
    var $body = $('body'),
        $toTop = $body.children('.totop');
    $toTop.html("");
    showScrollToTopDisplay = 'hidden';
    $toTop.on("click", function() {
        $body.animate({
            'scrollTop' : '0'
        }, 'slow', function() {
            showScrollToTopDisplay = 'hidden';
        });
        $toTop.stop(true, true).fadeOut();
    });
}

function showScrollToTop(e) {
    if ($(e).scrollTop() > 100) {
        if (showScrollToTopDisplay == 'hidden') {
            showScrollToTopDisplay = 'display';
            $('.totop').stop(true, true).fadeIn();
        }
    } else {
        if (showScrollToTopDisplay == 'display') {
            showScrollToTopDisplay = 'hidden';
            $('.totop').stop(true, true).fadeOut();
        }
    }
}

(function loginHandlers(){
    // login code start
    $(document).ready(function(){
        loginUserInit();
        floginInit();
        logoutmeInit();
        checkCookie();
        show_facebook_popup_check();
        setTimeout(checkIfFbLoaded, 7000);
    });

    // popup forms
    $('input#register').click(function(e) {
        e.preventDefault();
    });
    $("#register").click(function() {
        var first_name_value = $('#first_name').val();
        var last_name_value = $('#last_name').val();
        var sex_value = $('input[name="gender"]:checked').val();
        var email_value = $('#email').val();
        var password_value = $('#password').val();

        $.ajax({
            "type" : "POST",
            "url" : "http://www.mysmartprice.com/users/usermanage.php",
            "data" : {
                "name" : first_name_value + " " + last_name_value,
                "gender" : sex_value,
                "email" : email_value,
                "password" : password_value,
                "process" : "signup"
            }
        }).done(function(msg) {
            if (msg == 'error') {
                $("#confirmationMessageSignUp").show();
            //$("#confirmationMessageSignUp").html("");
            } else if (msg == 'formerror' || (last_name_value.length === 0)) {
                $("#confirmationMessageSignUp").show();
                $("#confirmationMessageSignUp").html("Please fill all the fields.");
            } else {
                $(".popup_overlay, .popup_wrapper_signupForm").fadeOut(500);
                var responseInfo = msg.split(",");
                loginme(email_value, "http://graph.facebook.com/2/picture", first_name_value + " " + last_name_value, responseInfo[1], sex_value);
                console.log(responseInfo);
            }
        });
    });

    $('input#emailLogin').click(function(e) {
        e.preventDefault();
    });
    $("#emailLogin").click(function() {
        var loginEmail_value = $('#login_email').val();
        var loginPassword_value = $('#login_password').val();
        $.ajax({
            "type" : "POST",
            "url" : "http://www.mysmartprice.com/users/usermanage.php",
            "data" : {
                "email" : loginEmail_value,
                "password" : loginPassword_value,
                "process" : "login"
            }
        }).done(function(msg) {
            if (msg == 'error') {
                $("#confirmationMessageLogin").show();
                $("#confirmationMessageLogin").html("Incorrect Email/Password combination");
            } else {
                $(".popup_overlay, .popup_wrapper_signupForm").fadeOut(500);
                var responseInfo = msg.split(",");
                var profile_pic = "http://graph.facebook.com/2/picture";
                console.log(responseInfo);
                if (getCookie("msp_user_image").length > 0)
                    profile_pic = getCookie("msp_user_image");
                loginme(responseInfo[1], profile_pic, responseInfo[2], responseInfo[0], responseInfo[3]);
            }
        });
    });

    $('input#forgotPass').click(function(e) {
        e.preventDefault();
    });

    $("#forgotPass").click(function() {
        var forgotEmail_value = $('#forgot_email').val();
        
        $.ajax({
            "type" : "POST",
            "url" : "http://www.mysmartprice.com/users/usermanage.php",
            "data" : {
                "email" : forgotEmail_value,
                "process" : "forgotpassword"
            }
        }).done(function(msg) {
            // alert(msg);
            if (msg == 'error') {
                $("#confirmationMessageForgot").show();
                $("#confirmationMessageForgot").html("Check email");
            } else {
                $("#confirmationForgot").show();
                $("#confirmationForgot").html("The email for resetting the password has been sent to you");
            }
        });
    });

    // popups
    $(".signupbutton").click(function() {
        $(".popup_overlay, .popup_wrapper_signup").fadeIn(500);
    });

    $(".loginbutton").click(function() {
        $(".popup_overlay, .popup_wrapper_loginForm").fadeIn(500);
    });

    $("#signupemail").click(function() {
        $(".popup_wrapper_signup, .popup_wrapper_loginForm").fadeOut(500);
        $(".popup_overlay, .popup_wrapper_signupForm").fadeIn(500);
    });

    $(".signinnow").click(function() {
        $(".popup_wrapper_signup, .popup_wrapper_signupForm, .popup_wrapper_forgot, #fb_login_popup, .extradark").fadeOut(500);
        $(".popup_overlay, .popup_wrapper_loginForm").fadeIn(500);
    });

    $("#signup").click(function() {
        $(".popup_wrapper_signup, .popup_wrapper_loginForm").fadeOut(500);
        $(".popup_overlay, .popup_wrapper_signup").fadeIn(500);
    });

    $('#forgotPassword, #forgotPassword2').click(function() {
        $(".popup_wrapper_loginForm, .popup_wrapper_signupForm").fadeOut(500);
        $(".popup_wrapper_forgot").fadeIn(500);
    });

    $('.popup_overlay').click(function() {
        $(".popup_overlay, .popup_wrapper_signup, .popup_wrapper_signupForm, .popup_wrapper_loginForm, .popup_wrapper_forgot, .extradark").fadeOut(500);
    });

    $(".popup_close").click(function() {
        $(".popup_overlay, .popup_wrapper_signup, .popup_wrapper_signupForm, .popup_wrapper_loginForm, .popup_wrapper_forgot, .extradark").fadeOut(500);
    });

    function removeCookie(c_name) {
        addCookie(c_name, '', -1);
    }

    function getCookie(c_name) {
        var ARRcookies = document.cookie.split(";");
        for (var i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
        return '';
    }

    function checkCookie() {
        var itzwowUserTrack_id = getCookie("itzwowUserTrack_id");
        if (itzwowUserTrack_id !== null && itzwowUserTrack_id !== "") {
        // returning user
        } else {
            itzwowUserTrack_id = uniqueid();
            if (itzwowUserTrack_id !== null && itzwowUserTrack_id !== "") {
                setCookie("itzwowUserTrack_id", itzwowUserTrack_id, 365);
            }
        }
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), 
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    //fb handlers
    window.fbAsyncInit = function() {
        FB.init({
            "appId" : '253242341485828', //mysmartprice:'516534571724606', // App ID
            "channelUrl" : 'http://www.itzwow.com/users/fbchannel.html', // Channel File
            "status" : true, // check login status
            "cookie" : true, // enable cookies to allow the server to access the session
            "xfbml" : true // parse XFBML
        });
        isLoaded = true;
        
        FB.Event.subscribe('comment.create', 
        function(response) {
            // alert('You liked the URL: ' + response);
            var comment_id = response.commentID;
            var product_id = getParameterByName('item_id');
            $.post('log_comment.php', {
                "comment_id" : comment_id,
                "product_id" : product_id
            }, function(result) {
            });
            ga('send', 'event', 'comment', product_id, user_id);
        
        });

    };

    function checkIfFbLoaded() {
        return isLoaded;
    }

    // Load the SDK Asynchronously
    (function(d) {
        var js, id = 'facebook-jssdk', 
        ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "http://connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));



    function fb_login() {
        var email = '';
        
        FB.login(function(response) {
            if (response.authResponse) {
                email = update_f_data_login(response);
                $('#fb_login_popup, .popup_overlay').hide();
                $('.signupbox-button').html('<span style="font-size: 16px;">Congrats!!! You will now receive the exclusive offer/vouchers valid for the purchased product.<br><br>Attractive Surprise gifts with FREE PRODUCTS every day!!!</span>');
                console.log(email);
                
                
                if (getCookie("promo").length > 0) {
                    /*
                               FB.ui({
    method: 'share',
    href: document.URL,
    }, function(response){});
                             */
                    
                    FB.api('/me/feed', 'post', {
                        "message" : 'Shop at Mysmartprice now! Exciting offers, including FREE PRODUCTS!!',
                        "link" : document.URL,
                        "name" : 'Shopping Festival at Mysmartprice',
                        "description" : "MySmartPrice is India's leading website for price and product comparison. We include all leading retailers and their products to help people 'where to buy' and 'what to buy'. One stop online shopping solution!"
                    }, function(data) {
                        console.log(data);
                    });
                }

            // loginme(email);
            } else {
                loginClassbackQueue = [];
            }
        }, {
            "scope" : "email,publish_actions"
        });
    }


    function uniqueid() {
        // always start with a letter (for DOM friendlyness)
        var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
        do {
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var ascicode = Math.floor((Math.random() * 42) + 48);
            if (ascicode < 58 || ascicode > 64) {
                // exclude all chars between : (58) and @ (64)
                idstr += String.fromCharCode(ascicode);
            }
        } while (idstr.length < 8);
        
        return (idstr);
    }

    function fb_login_middle() {
        FB.getLoginStatus(function(response) {
            if (response.status == 'connected' || response.status == 'not_authorized') {
                var iframe_code = ' <iframe src="http://www.facebook.com/plugins/facepile.php?app_id=253242341485828&amp;colorscheme=light&amp;size=small&amp;max_rows=1&amp;show_count=false" scrolling="no" frameborder="0" style="border:none;overflow:hidden;margin-left:40px;max-height:63px;width:400px;padding:0 15px;" allowTransparency="false"></iframe>';
                
                $("#the_frame_fb").html(iframe_code);
            } else
                $("#the_frame_fb").remove();
        });
        
        if (!$('.popup_overlay').is(':visible')) {
            $('#fb_login_popup, .popup_overlay, .extradark').fadeIn();
        }
        
        $('#close_fb_login_popup').click(function() {
            $('#fb_login_popup, .popup_overlay, .extradark').fadeOut();
        });
        $('.popup_overlay').click(function() {
            $('#fb_login_popup, .popup_overlay').fadeOut();
        });
        
        $("#signup_black").click(function() {
            $('#fb_login_popup, .extradark').fadeOut();
            $(".popup_wrapper_signupForm").fadeIn(500);
        });

    }

    function show_facebook_popup() {
        if (mspLoginStat === 0 && user_login_click === 0 && getCookie('popupshown') != 1) {
            fb_login_middle();
            addCookie('popupshown', 1);
        }
    }

    function show_facebook_popup_check() {
        setTimeout(show_facebook_popup(), 7000);
    }

    function update_f_data_login(info) {
        var email = '';
        var page_url = document.URL;
        
        jQuery.ajax({
            "url" : 'https://graph.facebook.com/me/?access_token=' + info.authResponse.accessToken,
            "dataType" : 'jsonp',
            "success" : function(data) {
                email = data.email;
                //console.log('successfully got data', data);
                // console.log('email'+email);
                data['access_token'] = info.authResponse.accessToken;
                console.log('success', data);
                jQuery.ajax({
                    "url" : 'http://www.mysmartprice.com/users/facebook_submit.php',
                    "type" : 'POST',
                    "data" : {
                        'fb' : data,
                        'page_type' : 'none',
                        'page_url' : page_url,
                        'product_category' : 'none'
                    },
                    "success" : function(response) {
                        var db_name = "";
                        $.get('http://www.mysmartprice.com/users/set_username_cookie.php', {"email" : email}, function(name) {
                            db_name = name;
                        });
                        if (db_name != "") {
                            data.name = db_name;
                        }
                        loginme(email, 'http://graph.facebook.com/' + info.authResponse.userID + '/picture', data.name, response, data.gender);

                    // $.fancybox.close();
                    //$(".userinfo img:first-child").attr('src','http://graph.facebook.com/' + info.authResponse.userID + '/picture');
                    //console.log('successfully submitted data');
                    //console.log(response);
                    }
                });
            },
            "error" : function(data) {
                console.log(data.error);
            }
        });

        mspLoginStat = 1;
        return email;
    }


    //login handlers
    function loginme(email, img, uname, uid, user_gender) {
        addCookie("msp_user_image", img, 365);
        addCookie("msp_login", 1, 365);
        addCookie("msp_login_email", email, 365);
        addCookie("msp_login_name", uname, 365);
        addCookie("msp_login_uid", uid, 365);
        addCookie("msp_user_gender", user_gender, 365);
        window['gender'] = user_gender;
        loginUserInit();
        while (loginClassbackQueue.length > 0) {
            (loginClassbackQueue.shift())();
        }
    }

    function logoutme() {
        // log this action
        $.get('/fb_share_logout.php', {
            "fb_share" : '0',
            "item_id" : gProdId
        }, function(result) {
        });
        addCookie("msp_login", '', -1);
        addCookie("msp_login_email", '', -1);
        addCookie("msp_login_name", '', -1);
        addCookie("msp_login_uid", '', -1);
        addCookie("msp_user_image", '', -1);
        addCookie("msp_user_gender", '', -1);
        loginUserInit();
    }

    function loginUserInit() {
        userEmail = getCookie('msp_login_email');
        mspLoginStat = getCookie("msp_login");
        fashion_update_ui();
    }

    function floginInit() {
        $('body').on('click', '.floginbutton', function() {
            if (mspLoginStat != 1)
                fb_login();
            else
                fashion_update_ui();
            return false;
        });
    }

    function logoutmeInit() {
        $('body').on('click', '.logoutme', function() {
            logoutme();
            return false;
        });
    }
    //ui for login handlers
    function fashion_update_ui() {
        if (mspLoginStat == 1) {
            $('.floginbutton').hide();
            $('.loginbutton').hide();
            $('.signupbutton').hide();
            $('.popup_wrapper_loginForm').fadeOut();
            $('.popup_wrapper_signup').fadeOut();
            $('.extradark').fadeOut();
            $('#login_banner_hide').hide();
            $('.after-login').find('img').attr('src', getCookie("msp_user_image"));
            $('.after-login').find('.users-name').text(getCookie("msp_login_name"));
            $('.after-login').find('a.mypage').attr('href', '/users/profile/' + getCookie("msp_login_uid"));
            $('.home').show();
            $('.after-login').show();
        } else {
            $('.after-login').hide();
            $('.floginbutton').show();
            $('.home').hide();
            $('.loginbutton').show();
            $('.signupbutton').show();
        }

    }
    // login code end
}());


// Single Page Code Start

if (isSingle(window.location.href)) {
    $.post('/fashion/single/similar_products', {
        "item_id" : $('.similarOrRelatedProducts').attr('data-item_id'),
        "subcategory" : $('.similarOrRelatedProducts').attr('data-subcategory'),
        "brand" : $('.similarOrRelatedProducts').attr('data-brand')
    }, function(data) {
        $('.similarOrRelatedProducts').append(data);
    });

    $.post('/fashion/single/recommended_product_deals', {
        "item_id" : $('.recommendedProductDeals').attr('data-item_id'),
        "subcategory" : $('.recommendedProductDeals').attr('data-subcategory'),
        "brand" : $('.recommendedProductDeals').attr('data-brand'),
        "price" : $('.afterOfferPrice').text()
    }, function(data) {
        $('.recommendedProductDeals').append(data);
    });
    $.post('/fashion/single/manual_comparison', {
        "item_id" : $('.recommendedProductDeals').attr('data-item_id'),
        "subcategory" : $('.recommendedProductDeals').attr('data-subcategory'),
        "brand" : $('.recommendedProductDeals').attr('data-brand'),
        "price" : $('.afterOfferPrice').text()
    }, function(data) {
       // $('.manualComparison').append(data);
    });
}


$('.sidebar-right .emailbox .subscribe').click(function() {
    var $emailbox = $(this).closest('.emailbox');
    var email = $emailbox.find('.email').val();
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid Email ID.");
        return false;
    }
    var page_url = window.location.href;
    $.ajax({
        'url' : '/fashion/promotion/capture_email',
        'type' : 'POST',
        'data' : {
            "email" : email,
            "page_url" : page_url,
            "type" : 'sidebar'
        },
        'dataType' : 'json',
    }).done(function(response) {
        if (response.data == "SUCCESS") {
            $emailbox.find('.text').text('Thank You!').css({
                'font-weight' : 'bolder',
                'text-align' : 'center'
            });
            $emailbox.find('.email').hide();
            $emailbox.find('.subscribe').hide();
        } else {
            alert(data);
        }
    });
    return false;
});

(function() {
    var gridid = $(".gridItemSingle").data("gridid");
    $(document).ready(function(){
        var $tableRows = $(".tecspec_table tr"),
            rowCount = $tableRows.length,
            maxRows = 10;
        $tableRows.slice(maxRows).hide();
        $(".tecspec_table").find("th").each(function() {
            var isHidden = !$(this).find("tr").filter(":visible").length;
            if (isHidden) {
                $(this).hide();
                $(".tecspec_table__view-all").removeClass("hidden");
            }
        });
    });

    $(".tecspec_table__view-all").on("click", function() {
        openPopup("http://www.mysmartprice.com/fashion/single/specifications_popup?gridid=" + gridid);
    });
})();
