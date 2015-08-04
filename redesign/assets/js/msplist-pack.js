var $ = jQuery;
var ListPage = {
	"settings" : {
		"filterLength" : 8
	},
	"controller" : {
		"init" : function () {
			// get page params and default values to get default filters to be applied.
			ListPage.controller.getDefaults();
			var lp_changes = ListPage.model.params.changes,
				lp_defaults = ListPage.model.params.defaults,
				lp_current = ListPage.model.params.current,
				lp_page = ListPage.model.params.page,
				lp_filterPlugins = ListPage.controller.filterPlugins,
				lp_clipboard = ListPage.model.clipboard;

			lp_filterPlugins.init(lp_defaults.startinr, lp_defaults.endinr);
			ListPage.controller.updatePage();

			// Add listeners to all inputs for applying or removing filters
			(function addActionListeners() {
				var clearGroupQueue = [],
					listenerTypes = [
						".fltr:not([groupname='price']) .js-fltr-val--mltpl:not(.js-fltr-val--dsbl)",
						".fltr:not([groupname='price']) .js-fltr-val--sngl:not(.js-fltr-val--dsbl)",
						".fltr[groupname='price'] .js-fltr-val--sngl:not(.js-fltr-val--dsbl)"
					];


				// globalSearch is comes from from hash so no listener.

				// // localSearch within the loaded product list
				// $('.local-search-form').on('submit', function () {
				// 	var localSearch = $.trim($(this).find('.list-local-search').val());
				// 	if (localSearch !== "") {
				// 		lp_changes.add.ss = localSearch;
				// 	} else if (lp_clipboard.prevLocalSearch) {
				// 		lp_changes.remove.ss = lp_clipboard.prevLocalSearch;
				// 	} else {
				// 		return false;
				// 	}
				// 	ListPage.controller.updatePage();
				// 	return false;
				// });

				// onclick a non-price multi value filter.
				$doc.on("click", ".fltr:not([groupname='price']) .js-fltr-val--mltpl:not(.js-fltr-val--dsbl)", function () {
					if (clearGroupQueue.length === 0) {
						$.merge(clearGroupQueue, $(this));
					}
					$(clearGroupQueue).each(function (i, item) {
						var context = $(item).hasClass("fltr-val--slctd") ? "remove" : "add",
							changes = lp_changes[context];
						if (typeof changes.property === "undefined") {
							changes.property = [];
						}
						changes.property.push($(item).attr('value'));
					});
					clearGroupQueue = [];
					ListPage.controller.updatePage();
				});
				
				// onclick a non-price single value filter.
				$doc.on("click", ".fltr:not([groupname='price']) .js-fltr-val--sngl:not(.js-fltr-val--dsbl)", function () {
					if (clearGroupQueue.length === 0) {
						$.merge(clearGroupQueue, $(this).closest(".fltr").find(".fltr-val--slctd"));
					}
					$(clearGroupQueue).each(function (i, item) {
						var context = $(item).hasClass("fltr-val--slctd") ? "remove" : "add",
							changes = lp_changes[context];
						if (typeof changes.property === "undefined") {
							changes.property = [];
						}
						changes.property.push($(item).attr('value'));
					});
					clearGroupQueue = [];
					ListPage.controller.updatePage();
				});
				
				// onclick a price single value filter.
				$doc.on("click", ".fltr[groupname='price'] .js-fltr-val--sngl:not(.js-fltr-val--dsbl)", function () {
					var filterVal = $(this).attr('value'),
						values = filterVal.split(";"),
						minPrice = parseInt(values[0], 10),
						maxPrice = parseInt(values[1], 10),
						context = $(this).hasClass("fltr-val--slctd") ? "remove" : "add",
						displayPrices = {};
					$.extend(lp_changes[context], {
						"startinr" : minPrice,
						"endinr" : maxPrice
					});

					ListPage.controller.updatePage();
				});
				
				// clear all apllied filters in a filtergroup
				$doc.on("click", ".fltr__cler", function () {
					var $currentGroup = $(this).closest(".fltr"),
						groupname = $currentGroup.attr('groupname'),
						$activeFilters = $currentGroup.find(".fltr-val--slctd");
					if (groupname == "price") {
						$.extend(lp_changes.remove, {
							"startinr" : lp_clipboard.prevMinPrice,
							"endinr" : lp_clipboard.prevMaxPrice
						});
						ListPage.controller.updatePage();
					} else {
						$.merge(clearGroupQueue, $currentGroup.find(".fltr-val--slctd"));
						$.each(listenerTypes, function (i, selector) {
							if ($currentGroup.find(".fltr-val").eq(0).is(selector)) {
								$activeFilters.eq(0).click();
								return;
							}
						});
					}
				});
				
				// edit min and max price numbers in inputfiled
				$doc.on("change", ".js-fltr-prc__inpt-min, .js-fltr-prc__inpt-max", function () {
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
									"startinr" : minPrice,
									"endinr" : maxPrice
								});
							} else {
								// if new price range is total range then remove existing price filter.
								$.extend(lp_changes.remove, {
									"startinr" : lp_clipboard.prevMinPrice,
									"endinr" : lp_clipboard.prevMaxPrice
								});
							}
							ListPage.controller.updatePage();
							return;
						}
					}
					$minPriceInpt.val(lp_clipboard.prevMinPrice);
					$maxPriceInpt.val(lp_clipboard.prevMaxPrice);
			    });
				
				// // remove applied filter by clicking tags shown above product list.
				// $(".gridheader").on("click", ".remfilter", function removeTag() {
				// 	var remfilterQueue = [],
				// 		filterVal, $filterItem, minPrice, maxPrice;
				// 	if ($(this).hasClass('all')) {
				// 		$('.remfilter').each(function () {
				// 			$.merge(remfilterQueue, $(this));
				// 		});
				// 	} else {
				// 		$.merge(remfilterQueue, $(this));
				// 	}

				// 	// batch changes(DOM write operatations ie. to uncheck filters/remove tags) to trigger only one render operation.
				// 	$.each(remfilterQueue, function (i, filter) {
				// 		if ($(filter).attr('groupname') == 'searchTerm') {
				// 			lp_changes.remove.s = $(filter).attr("value");
				// 		} else if ($(filter).attr('groupname') == 'localSearch') {
				// 			lp_changes.remove.ss = $(filter).attr("value");
				// 		} else if ($(filter).attr('groupname') == 'price') {
				// 			$.extend(lp_changes.remove, {
				// 				"startinr" : parseInt($(filter).attr("value").split(";")[0], 10),
				// 				"endinr" : parseInt($(filter).attr("value").split(";")[1], 10)
				// 			});
				// 		} else {
				// 			filterVal = $(filter).attr('value');
				// 			$filterItem = $('.list_filter_val.active[value="' + filterVal + '"]');
				// 			if ($filterItem.is(":not(.price_val, .unavailable)")) {
				// 				if ($filterItem.is(".multi") && clearGroupQueue.length === 0) {
				// 					$.merge(clearGroupQueue, $filterItem);
				// 				} else if ($filterItem.is(".single") && clearGroupQueue.length === 0) {
				// 					$.merge(clearGroupQueue, $filterItem.closest(".list_filter").find("active"));
				// 				}
				// 				$.each(clearGroupQueue, function (i, item) {
				// 					var context = $(item).hasClass("active") ? "remove" : "add",
				// 						changes = lp_changes[context];
				// 					changes.property = changes.property || [];
				// 					changes.property.push($(item).attr('value'));
				// 				});
				// 				clearGroupQueue = [];
				// 			} else {}
				// 		}
				// 	});
				// 	ListPage.controller.updatePage();
				// });
				
				// sorting options.
				$("body").on("change", ".fltr-actnbr__sort", function () {
					var sortVal = $(this).val();
					lp_changes.add.sort = sortVal;
					ListPage.controller.updatePage();
				});
				
				// pagination.
				$(".product-list").on("click",".js-pgntn__item", function () {
					if(!$(this).hasClass("pgntn__item--crnt")) {
						var pgno = $(this).data('pageno');
						lp_changes.add.page = pgno;
						ListPage.controller.updatePage();
					}
					return false;
				});
			}());
		},
		"getDefaults" : function () {
			var lp_defaults = ListPage.model.params.defaults,
				lp_clipboard = ListPage.model.clipboard,
				pageParams = (function () {
					var $bodyWrapper = $('.body-wrpr'),
						params = {};
					if ($bodyWrapper.attr('category')) {
						params.subcategory = $bodyWrapper.attr('category');
					}
					if ($bodyWrapper.attr("start_price") || $bodyWrapper.attr("end_price")){
						params.startinr = parseInt($bodyWrapper.attr("start_price") || $(".js-fltr-prc__inpt-min").attr("val"), 10);
						params.endinr = parseInt($bodyWrapper.attr("end_price") || $(".js-fltr-prc__inpt-max").attr("val"), 10);
					}
					if ($bodyWrapper.attr("brand")) {
						params.property = params.property || "";
						params.property += $(".list_filter_val[dispname='" + $bodyWrapper.attr('brand') + "']").attr("value") + "|";
					}
					if ($bodyWrapper.attr("property")) {
						params.property = params.property || "";
						params.property += $bodyWrapper.attr('property') + "|";
					}
					if ($bodyWrapper.attr("properties")) {
						params.property = params.property || "";
						params.property += $bodyWrapper.attr('properties');
					}

					if (params.property) {
						params.property = $.grep(params.property.split("|").sort(), function (e, i) { return (e !== ""); });
					}
					
					return params;
				}());
			$.extend(ListPage.model.params.page, pageParams);

			// get supported values of min and max price values by the slider.
			$.extend(lp_defaults, {
				"priceMin" : parseInt($('.fltr-prc__sldr').attr('value').split(';')[0], 10),
				"priceMax" : parseInt($('.fltr-prc__sldr').attr('value').split(';')[1], 10)
			});

			// store inital values as previous values when values change.
			$.extend(lp_clipboard, {
				"prevMinPrice" : parseInt($('.fltr-prc__sldr').attr('value').split(';')[0], 10),
				"prevMaxPrice" : parseInt($('.fltr-prc__sldr').attr('value').split(';')[1], 10)
			});
		},
		"filterPlugins" : {
			"init" : function (minPrice, maxPrice) {
				var minSlider = minPrice ? this.priceSlider.priceToRange(minPrice) : 0,
					maxSlider = maxPrice ? this.priceSlider.priceToRange(maxPrice) : 200;
				ListPage.controller.filterPlugins.nanoScrollbarInit();
				$(".fltr-prc__sldr").slider({
					range: true,
					min: 0,
					max: 200,
					values: [minSlider || 0, maxSlider || 200],
					step: 1,
					animate: true,
					slide: ListPage.controller.filterPlugins.priceSlider.callback,
					stop: function (a, b) {
						if (b.values[0] == 0 && b.values[1] == 200) {
							// if range is equal to total range then remove price filter
							ListPage.model.params.changes.remove.startinr = ListPage.model.clipboard.prevMinPrice;
							ListPage.model.params.changes.remove.endinr = ListPage.model.clipboard.prevMaxPrice;
						} else {
							// if range is not equal to total range then add new price filter
							ListPage.model.params.changes.add.startinr = ListPage.controller.filterPlugins.priceSlider.rangeToPrice(b.values[0]);
							ListPage.model.params.changes.add.endinr = ListPage.controller.filterPlugins.priceSlider.rangeToPrice(b.values[1]);
						}
						ListPage.controller.updatePage();
						$('.fltr-prc__sldr').slider('values', [b.values[0], b.values[1]]);
					}
				});
				if (minPrice || maxPrice) {
					$(".js-fltr-prc__inpt-min").val(minPrice || ListPage.model.params.defaults.startinr);
					$(".js-fltr-prc__inpt-max").val(maxPrice || ListPage.model.params.defaults.endinr);
				}
			},
			"priceSlider" : {
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
			"nanoScrollbarInit" : function () {
				$('.fltr-val-wrpr.nano').each(function () {
					var totalHeight;
					$filteritem = $('.fltr-val', $(this));
					if ($filteritem.length <= ListPage.settings.filterLength) {
						totalHeight = 0;
						$filteritem.each(function () {
							totalHeight += $(this).outerHeight(true);
						});
						if (totalHeight < 224) $(this).css('height', totalHeight + 'px');
					}
				});
				$('.nano').nanoScroller({
					alwaysVisible: true
				});
			},
		},
		// once changes are update the page state before rendering the view.
		"updatePage" : function () {
			var lp_current = ListPage.model.params.current,
				lp_changes = ListPage.model.params.changes,
				lp_defaults = ListPage.model.params.defaults,
				lp_page = ListPage.model.params.page,
				lp_clipboard = ListPage.model.clipboard,
				initHash, prop_strings;

			lp_clipboard.isOnLoad = $.isEmptyObject(lp_current);
			lp_current.subcategory = lp_current.subcategory || lp_page.subcategory;
				
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
				$.each(lp_changes.remove, function (key1) {
					var index;
					if (key1 === "property") {
						if ("property" in lp_changes.remove) {
							$.each(lp_changes.remove.property, function (key2) {
								index = lp_current.property.indexOf(lp_changes.remove.property[key2]);
								lp_current.property.splice(index, 1);
							});
							if (lp_current.property.length === 0) {
								delete lp_current.property;
							}
						}
					} else {
						delete lp_current[key1];
					}
				});
			} else {
				// if isOnLoad get current params from url hash.
				$.extend(lp_current, (function () {
					initHash = window.location.hash;
					prop_strings = initHash.replace("#", "").split('&');
					if (prop_strings[0] !== "") {
						$.each(prop_strings, function (i, prop_string) {
							lp_current[prop_string.split("=")[0]] = prop_string.split("=")[1];
						});
						if ("property" in lp_current) {
							lp_current.property = $.grep(lp_current.property.split("|").sort(), function (e, i) {
								return (e !== "");
							});
						}
						if ("startinr" in lp_current || "endinr" in lp_current) {
							lp_current.startinr = parseInt(lp_current.startinr, 10);
							lp_current.endinr = parseInt(lp_current.endinr, 10);
						}
					}
					if (lp_current.startinr === lp_defaults.priceMin && lp_current.endinr === lp_defaults.priceMax) {
						delete lp_current.startinr;
						delete lp_current.endinr;
					}

					return lp_current;
				}()));

				(function () {
					var currentLength = 0;
					$.each(lp_current, function () { currentLength++; });

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
				lp_clipboard.isLoadParamsEqualtoPageParams = (ListPage.services.generateHash(lp_current) === ListPage.services.generateHash(lp_page));
			}

			//generate new hash, and start view rendering.
			ListPage.model.hash = ListPage.services.generateHash(lp_current);
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
				"startinr" : "", //price min
				"endinr" : "", //price max
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
			"init" : function () {
				var lp_current = ListPage.model.params.current,
					lp_changes = ListPage.model.params.changes,
					lp_defaults = ListPage.model.params.defaults,
					lp_page = ListPage.model.params.page,
					lp_clipboard = ListPage.model.clipboard,
					lp_filterPlugins = ListPage.controller.filterPlugins,
					filterControls;
				
				window.location.hash = ListPage.model.hash;
				
				if (lp_clipboard.isOnLoad) {
					$(".list-hdr, .js-cntxt-link-list").show();
				}
				if (ListPage.services.generateHash(lp_current) !== ListPage.services.generateHash(lp_page)) {
					$(".list-hdr, .js-cntxt-link-list").hide();
				}

				// get new product list and filters based on updated current params
				ListPage.view.updateData();
				
				// operations to be done to add/remove filters.
				filterControls = {
					"add" : function () {
						var allTagsHtml = "", $filterGroupOptions;
						
						// initialize all filtergroups, cleargroups as inactive and activate based on current params
						$(".fltr__cler").hide();
						//$('.fltr__val').removeClass('active');
						
						// apply all filters registered on filterControls.add.queue
						$.each(filterControls.add.queue, function (i, listItem) {
							// batch html of all the filters to append all filter tags in one go.
							
							allTagsHtml += [
								'<div',
									' class="remfilter" ' + (listItem.groupname ? 'groupname="' + listItem.groupname + '"' : ""),
									' value="' + listItem.value + '"',
								'>',
									'<img src="http://fashion.mysmartprice.com/images/search_clear.png" class="filterAppliedClear"> ',
									listItem.label,
								'</div>'
							].join("");
							if ("value" in listItem) {
								$filterGroup = $(".fltr[groupname='" + listItem.groupname + "']");
								$filterGroupOptions = $filterGroup.find('.fltr-val');
								if ($filterGroupOptions.hasClass("js-fltr-val--sngl") || listItem.groupname == 'localSearch') {
									$(".remfilter[groupname='" + listItem.groupname +"']").remove();
									$filterGroupOptions.closest(".fltr").find(".fltr-val").removeClass("fltr-val--slctd");
								}
								$filterGroupOptions.filter("[value='" + listItem.value + "']").addClass("fltr-val--slctd");
								$filterGroup.find(".fltr__cler").show();
							}
							if (listItem.groupname == 'price') {
								// update priceSlider range points
								$('.fltr-prc__sldr').slider('values', [
									lp_filterPlugins.priceSlider.priceToRange(listItem.value.split(";")[0]),
									lp_filterPlugins.priceSlider.priceToRange(listItem.value.split(";")[1])
								]);
								$(".js-fltr-prc__inpt-min").val(listItem.value.split(";")[0]);
								$(".js-fltr-prc__inpt-max").val(listItem.value.split(";")[1]);
							}
						});
						if (allTagsHtml !== "" && $(".remfilter.all").length === 0) {
							allTagsHtml += '<div class="remfilter all">CLEAR ALL</div>';
							$('.apld-fltrs').addClass('space');
						}
						$('.apld-fltrs').append(allTagsHtml);
						
						// $('.list_filter_val.active').each(function () { 
						// 	$(this).closest(".list_filter").find(".cleargroup").addClass("show");
						// 	$(this).closest('.list_filter').find('.filter_name').addClass('active');
						// });
					},
					"remove" : function () {
						// initialize all filtergroups, cleargroups as inactive and activate based on current params
						$(".fltr__cler").show();
						// $(".filter_name").removeClass("active");

						// remove all filters registered on filterControls.remove.queue
						$.each(filterControls.remove.queue, function (i, listItem) {
							var $filterOption;
							$filterOption = $(".fltr-val[value='" + listItem.value + "']");
							$filterOption.removeClass("fltr-val--slctd");
							if ($filterOption.closest(".fltr").find(".fltr-val--slctd").length === 0) {
								$filterOption.closest(".fltr").find(".fltr__cler").hide();
							}
							$(".remfilter[value='" + listItem.value + "'][groupname='" + listItem.groupname + "']").remove();
							if (listItem.groupname == 'price') {
								// update priceSlider range points
								$('.fltr-prc__sldr').slider('values', [ 0, 200 ]);
								$(".js-fltr-prc__inpt-min").val(lp_defaults.priceMin);
								$(".js-fltr-prc__inpt-max").val(lp_defaults.priceMax);
							}
						});

						// if all filter tags removed remove "clear all" filter tag also
						if ($('.remfilter').length == $('.remfilter.all').length) {
							$('.remfilter.all').remove();
							$('.apld-fltrs').removeClass('space');
						}

						// show cleargroup buttons for applied filter's groups
						$('.fltr-val--slctd').each(function () {
							$(this).closest(".fltr").find(".fltr__cler").show();
							//$(this).closest('.list_filter').find('.filter_name').addClass('active');
						});
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
							"value" : lp_changes[action].s,
							"label" : lp_changes[action].s,
							"groupname" : "searchTerm"
						});
					}
					if ("sort" in lp_changes[action]) {
						$('.fltr-actnbr__sort option[value="' + lp_changes[action].sort + '"]').attr('selected', 'selected');
					}
					// if ("ss" in lp_changes[action]) {
					// 	$('.list-local-search').val(lp_current.ss);
					// 	filterControls[action].queue.push({
					// 		"value" : lp_changes[action].ss,
					// 		"label" : lp_changes[action].ss,
					// 		"groupname" : "localSearch"
					// 	});
					// }
					if (("startinr" in lp_changes[action]) && ("endinr" in lp_changes[action])) {
						(function () {
							var value, label, groupname, minSlider, maxSlider;
							value = lp_changes[action].startinr + ';' + lp_changes[action].endinr;
							label = lp_changes[action].startinr.toLocaleString() + "-" + lp_changes[action].endinr.toLocaleString();
							groupname = 'price';
							filterControls[action].queue.push({
								"value" : value,
								"label" : label,
								"groupname" : groupname,
							});
							// if price filter is to be added update slider values to new values
							if (action === "add") {
								lp_clipboard.slider.priceMin = lp_changes.add.startinr;
								lp_clipboard.slider.priceMax = lp_changes.add.endinr;
							// if price filter is to be removed update slider values to min and max values.
							} else {
								lp_clipboard.slider.priceMin = lp_defaults.priceMin;
								lp_clipboard.slider.priceMax = lp_defaults.priceMax;
							}
						}());
					}
					if ("property" in lp_changes[action]) {
						$.each(lp_changes[action].property, function (i, value) {
							var label = $(".fltr-val[value='" + value + "']").attr("dispname"),
								groupname = $('.fltr-val[value="'+ value +'"]').closest(".fltr").attr("groupname");
							filterControls[action].queue.push({
								"value" : value,
								"label" : label,
								"groupname" : groupname
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
					"prevMinPrice" : lp_current.startinr || lp_defaults.minPrice,
					"prevMaxPrice" : lp_current.endinr || lp_defaults.maxPrice,
					"prevLocalSearch" : lp_current.ss || ""
				});

				// after all changes reflected in the view re-initialize changes to empty.
				$.extend(lp_changes, { 
					"add" : {},
					"remove" : {}
				});
			}
		},
		"updateData" : function () {
			if ($(".body-wrpr").length !== 0) {
				var cache = this.updateData._cache_ = this.updateData._cache_ || { "queries" : [], "responses" : [] },
					lp_current = $.extend({}, ListPage.model.params.current),
					lp_filterPlugins = ListPage.controller.filterPlugins,
					lp_defaults = $.extend({}, ListPage.model.params.defaults),
					lp_clipboard = ListPage.model.clipboard,
					xhrSuccess, xhrPerf, query, freshData, minSlider, maxSlider;
				// generate query from all the new page state params
				query = ["subcategory=" + lp_current.subcategory,
						 lp_current.s ? ("&s=" + lp_current.s) : "",
						 lp_current.property ? ("&property=" + lp_current.property.join("|")) : "",
						 (lp_current.startinr || lp_current.endinr) ? ("&startinr=" + lp_current.startinr + "&endinr=" + lp_current.endinr) : "",
						 lp_current.sort ? ("&sort=" + lp_current.sort) : "",
						 lp_current.ss ? ("&ss=" + lp_current.ss) : "",
						 lp_current.page ? ("&page=" + lp_current.page) : ""].join("");
				xhrSuccess = function (response) {
					freshData = response.split("//&//#");
					ListPage.model.params.current.page = undefined;
					// load new filters
					$(".fltr-wrpr1").html(freshData[0]);
					if (!lp_clipboard.isLoadParamsEqualtoPageParams) {
						// load new products
						$(".js-prdct-list").html(freshData[1]);
						// update product count data  above product list
						
						// $(".list-prod-count").text($(".product-list .product-count-from-ajax").data('count'));
						// $(".list-prod-count-total").text($(".product-list .product-count-from-ajax").data('total'));
					} else {
						lp_clipboard.isLoadParamsEqualtoPageParams = false;
					}
					lp_filterPlugins.init(lp_clipboard.slider.priceMin, lp_clipboard.slider.priceMax);
				}

				// check if query in cache to load response from cache.
				if (cache.queries.indexOf(query) >= 0) {
					// setTimeout(($(".filter-loading-icon").show(), function () {
					// 	$(".filter-loading-icon").hide();
					// }), 500);
					xhrSuccess(cache.responses[cache.queries.indexOf(query)]);
					if (_gaq) _gaq.push(['_trackEvent', 'desktop_listpage_filter', 'xhrLoad', 'time', 0]);
				} else {
					if (!lp_clipboard.isLoadParamsEqualtoPageParams) {
					//	$(".filter-loading-icon").show();
					}
					xhrPerf = { start : +new Date() };
					// abort pending XHR's for latest XHR to deal with rapid filter changes.
					if (ListPage.view.updateData.XHR) {
						ListPage.view.updateData.XHR.abort();
					}
					ListPage.view.updateData.XHR = $.ajax({
						url: "/msp/processes/property/api/msp_get_html_for_property_new.php?" + query,
					}).done(function (response) {
						xhrPerf.end = +new Date();
						xhrPerf.time = (xhrPerf.end - xhrPerf.start)/1000;
						// record xhrLoad Time to GA.
						if (_gaq) _gaq.push(['_trackEvent', 'desktop_listpage_filter', 'xhrLoad', 'time', xhrPerf.time]);
						xhrSuccess(response);
						// cache query-response pair
						cache.queries.push(query);
						cache.responses.push(response);
						// remove oldest entry if cache size exceeds 25
						if (cache.queries.length > 25) {
							cache.queries.shift();
							cache.responses.shift();
						}
					}).always(function () {
						//$(".filter-loading-icon").hide();
					});
				}
				if (_gaq) _gaq.push(['_trackEvent', 'finder', 'query', query]);
			}
		}
	},
	"services" : {
		"generateHash" : function (params) {
			var hash = "#", index = 0;
			$.each(params, function (key) {
				var value, prefix;
				if (params[key]) {
					prefix = index ? "&" : "";
					value = key === "property" ? params[key].join("|") : params[key];
					hash += prefix + key + "=" + value;
				}
				index++;
			});
			return hash;
		}
	}
};

(function ($) {
    $.QueryString = (function (a) {
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

//For adding a cookie if utm_source is availble.
console.log($.QueryString['utm_source']);
if ($.QueryString["utm_source"]) {
    console.log($.QueryString['utm_source']);
    setCookie("utm_source", $.QueryString['utm_source']);
}

// // if category is mobile then first show mobile list and then show applied filters list.
// if ($("#mobilefilterwrapper").length) {
// 	$.ajax({
// 		url: "/msp/prop_filters/mobile-new.html"
// 	}).done(function (response) {
// 		var data = response.split("//&//#");
// 		$("#mobilefilterwrapper").html(data[0]);
// 		$(".listitems_rd").html(data[1]);
// 		ListPage.controller.init();
// 	});
// } else {
	ListPage.controller.init();
//}

// binding other links to filters.
// $(".js-prdct-list").on("click", "#viewallbestsellers", function () {
// 	$("#showonlybestsellers").click();
// });

// search in filter groups.
$(".fltr-wrpr1").on("keyup", ".filterSearch", function () {
	var filterSearchQuery = $.trim($(this).val()),
		$filterBlock = $(this).closest(".fltr");
	if (filterSearchQuery === "") {
		$filterBlock.find(".fltr-val").show();
		$filterBlock.find(".fltr__cler").hide();
		$filterBlock.find(".nano").nanoScroller();
	} else {
		$filterBlock.find(".fltr-val").hide();
		$filterBlock.find(".fltr__cler").show();
		$filterBlock.find(".fltr-val").filter(function () {
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
		$filterBlock.find(".nano").nanoScroller();
	}
});

// clear search in filterGroups
$(".fltr-wrpr1").on("click", ".fltr-srch__cler", function () {
	var $filterGroup = $(this).closest(".fltr");
	$filterGroup.find(".fltr-srch__fld").val("");
	$(this).hide();
	$filterGroup.find(".fltr-val").show();
	$filterGroup.find(".nano").nanoScroller();
});
