MSP = {
    "dataPoints" : {
        headerHeight : $(".hdr-size").height()
    },
    "utils" : {
        /**
         * $.selectText()
         * => selects the text of the jquery node on which the method is invoked.
         * => used to to make coupon codes easily selectable by user onclick.
         */
        "parse" : {
            /**
             * MSP.utils.numberFrom.price(price)
             * => converts price values to numbers.
             * @param {string} price -> string with digits formatted with commas 
             * @return {number} price -> string with digits formatted with commas
             */
            "numberFrom" : {
                "price" : function(price) {
                    return parseInt(price.replace(/\D/g, ""), 10);
                }
            },
            /**
             * MSP.utils.urlFrom.bgImage(price)
             * => get url from background-image property values.
             * @param {string} price -> css background-image propery.
             * @return {string} price -> background image source url.
             */
            "urlFrom" : {
                "bgImage" : function(bgProp) {
                    bgProp.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                }
            }
        },
        "validate" : (function() {
            var _regex = {
                "text" : /^[a-z\d\-_\s]+$/i,
                "number" : /^\d+$/,
                "email" : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            };

            function _testPattern(type, value) {
                var result = _regex[type].test(value);
                
                return result;
            }

            return {
                "rating" :  function(value, options) {
                    return !!parseInt(value, 10);
                },
                "text" : function (value, options) {
                    var isWithinLimits = (function() {
                        var result = true,
                            minLength = options && options.min && parseInt(options.min, 10),
                            maxLength = options && options.max && parseInt(options.max, 10);

                        if (minLength && value.length < options.min) {
                            result = false;
                        }
                        if (maxLength && value.length > minLength) {
                            result = false;
                        }
                        return result;
                    }());
                    return _testPattern("text", $.trim(value)) && value && isWithinLimits;
                },
                "number" : function(value, options) {
                    return _testPattern("number", value);
                },
                "email" : function(value, options) {
                    return _testPattern("email", value);
                },
                /** MSP.utils.validate.form(formData)
                 *
                 * @param {array} formData -> [{ -> array of objects having info of each form field.
                 *   @param {string} "type" : "email", -> input validation type
                 *   @param {$node} "inputField" : $('.form-inpt'), -> jquery node of input field
                 *   @param {$node} "errorNode" : $(".js-vldtn-err"), -> jquery node of validation error message.
                 *   @param {object} "options" -> type specific extra checks 
                 * }, .....]
                 * 
                 * @return {object: promise} -> provides .done() and .fail() methods on the function call.
                 */
                "form" : function(formData) {
                    var dfd = $.Deferred(),
                        isValid = true,
                        check = this,
                        $firstErrorField;

                    $.each(formData, function(i, field) {
                        var result = check[field.type](field.inputField.val(), field.options);

                        if (result === false) {
                            if (field.errorNode instanceof jQuery) {
                                field.errorNode.slideDown({ "easing" : "swing" });
                                if (!$firstErrorField && field.inputField) {
                                    $firstErrorField = field.inputField;
                                    $firstErrorField.focus();
                                }
                            }
                            isValid = false;
                        } else {
                            field.errorNode.slideUp({ "easing" : "swing" });
                        }
                    });

                    if (isValid) {
                        dfd.resolve();
                    } else {
                        dfd.reject();
                    }

                    return dfd.promise();
                }
            };
        }()),
        /**
         * $.memoize(task[, options]) 
         * => returns a new function which caches return values for given args.
         * => generally used to cache REST API ajax calls.
         * 
         * @param {function} task -> Task to be memoized with a promise return value. (pass function's promise).
         * @param {object} options: {
         *   @param {number} cacheLimit -> max no. of results that can be stored in cache.
         * }
         *
         * @return {function} memoizedTask
         */
        "memoize" : function _memoize(task, options) {
            var memoizeCache = _memoize._cache_ || {},
                cacheLimit = options && options.cacheLimit,
                resultTask;

            memoizeCache[task.toString()] = { "queries" : [], "results" : [] };
            resultTask = function _memoizedTask() {
                var cache = memoizeCache[task.toString()],
                    dfd = $.Deferred(),
                    query = JSON.stringify(arguments),
                    result;

                if (cache.queries.indexOf(query) !== -1) {
                    result = cache.results[cache.queries.indexOf(query)];
                    dfd.resolve(result);
                } else {
                    task.apply(this, arguments).done(function (result){
                        cache.queries.push(query);
                        cache.results.push(result);
                        if (cacheLimit) {
                            if (cache.queries.length > cacheLimit) {
                                cache.queries.shift();
                                cache.responses.shift();
                            }
                        }
                        dfd.resolve(result);
                    });
                }
                return dfd.promise();
            };

            return resultTask;
        },
        /**
         * $.throttle(task, timeout[, context])
         * => restricts execution of continuosly asks tasks to interval spaced executions.
         * => generally used to to make continuosly fired event handler callbacks performant.
         * 
         * @param {function} task -> task to be throttled.
         * @param {number:seconds} timeout: -> interval between two task executions.
         * @param {object} context -> task will be exected as a method of this object.
         *
         * @return {function} debouncedTask
         */
        "throttle" : function _throttle(task, timeout, context) {
            var timer, args, needInvoke;
            return function() {
                args = arguments;
                needInvoke = true;
                context = context || this;
                if (!timer) {
                    (function() {
                        if (needInvoke) {
                            task.apply(context, args);
                            needInvoke = false;
                            timer = setTimeout(arguments.callee, timeout);
                        } else {
                            timer = null;
                        }
                    }());
                }
            };
        },
        /**
         * $.debounce(task, timeout[, invokeAsap[, context]])
         * => returns a new function which memoizes return values for given args.
         * => used to to make continuosly fired event handler callbacks run once.
         *
         * @param {function} task -> task to be debounced.
         * @param {number: seconds} timeout: -> interval between two task executions.
         * @param {boolean} invokeAsap -> task to be executed after first call of the event or not.
         * @param {object} context -> task will be exected as a method of this object.
         *
         * @return {function} debouncedTask
         */
        "debounce" : function _debounce(task, timeout, invokeAsap, context) {
            var timer;

            if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
                context = invokeAsap;
                invokeAsap = false;
            }
            
            return function() {
                var args = arguments;
                context = context || this;
                invokeAsap && !timer && task.apply(context, args);
                clearTimeout(timer);
                timer = setTimeout(function() {
                    !invokeAsap && task.apply(context, args);
                    timer = null;
                }, timeout);
            };
        },
        /**
         * $.selectText()
         * => selects the text of the jquery node on which the method is invoked.
         * => used to to make coupon codes easily selectable by user onclick.
         * @param {$node} $node -> 
         */
        "selectText" : (function() {
            var _range, _selection;
            var _is = function(o, type) {
                return typeof o === type;
            };

            if (_is(document.getSelection, 'function')) {
                _selection = document.getSelection();

                if (_is(_selection.setBaseAndExtent, 'function')) {
                    
                    // Chrome, Safari
                    return function _selectText($node) {
                        var selection = _selection;
                        var node = $node.get(0);
                        
                        selection.setBaseAndExtent(node, 0, node, $(node).contents().size());

                        // Chainable
                        return this;
                    };
                } else if (_is(document.createRange, 'function')) {
                    _range = document.createRange();

                    if (_is(_range.selectNodeContents, 'function')
                        && _is(_selection.removeAllRanges, 'function')
                        && _is(_selection.addRange, 'function')) {
                        
                        // Mozilla
                        return function _selectText() {
                            var range = _range;
                            var selection = _selection;
                            var node = this[0];

                            range.selectNodeContents(node);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            
                            // Chainable
                            return this;
                        };
                    }
                }
            } else if (_is(document.body.createTextRange, 'object')) {

                _range = document.body.createTextRange();

                if (_is(range.moveToElementText, 'object') && _is(range.select, 'object')) {
                    
                    // IE11- most likely
                    return function _selectText() {
                        var range = document.body.createTextRange();
                        var node = this[0];

                        range.moveToElementText(node);
                        range.select();
                        
                        // Chainable
                        return this;
                    };
                }
            }
        }()),
        "lazyLoad" : (function() {
            var _queue = [];

            return {
                /** MSP.utils.lazyLoad.run()
                 * => runs each task pushed to the lazyload queue when their corresponding scroll condition is statisfied.
                 * => used to load on demand images, widgets which slow down page load times.
                 */
                "run" : function() {
                    for (i = 0; i < _queue.length; i++) {
                        (function() {
                            var callback = _queue[i].callback,
                                position = _queue[i].position;
                                triggerPoint = (position || _queue[i].node.offset().top) - $(window).height();

                            if ($win.scrollTop() > triggerPoint) {
                                callback.definition.apply(callback.context, callback.arguments);
                                _queue.splice(i, 1);
                                i--;
                            }
                        }());
                    }
                },
                /**
                 * MSP.utils.lazyLoad.assign => accepts a task to be executed on reaching scroll position of given node.
                 * 
                 * @param {object} task -> {
                 *   @param {$node} "node" : $node, // jquery node
                 *   @param {function} "callback" : {
                 *     "definition" : callbackFunction, // defintion of the task to be run
                 *     "context" : this,
                 *     "arguments" : [args,...] // arguments of the task if any.
                 *   }
                 * }
                 *
                 * @return {object} lazyload -> to enable chaining -> .run() for immediate invocation.
                 */
                "assign" : function(task) {
                    _queue.push(task);
                    return this;
                }
            };
        }()),
        "browser" : {
            "name" : (function() {
                var result = null,
                    ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("msie") !== -1 && ua.indexOf("trident") !== -1 && ua.indexOf("edge") !== -1) {
                    result = "MSIE";
                } else if (ua.indexOf("firefox") !== -1) {
                    result = "firefox";
                } else if (ua.indexOf("chrome") !== -1 && ua.indexOf("opr") === -1) {
                    result = "chrome";
                }
                return result;
            }()),
            "version" : (function() {
                var userAgent = navigator.userAgent.toLowerCase();
                return (/msie/.test(userAgent) ? (parseFloat((userAgent.match(/.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/) || [])[1])) : null);
            }())
        },
        /**
         * MSP.utils.cycleShift => cycle through set of values
         * 
         * @param {object} task -> {
         *   @param {$node} "node" : $node, // jquery node
         *   @param {function} "callback" : {
         *     "definition" : callbackFunction, // defintion of the task to be run
         *     "context" : this,
         *     "arguments" : [args, ...] // arguments of the task if any.
         *   }
         * }
         *
         * @return {object} lazyload -> to enable chaining -> .run() for immediate invocation.
         */
        "cycleShift" : function(valueSet, currentValue) {
            var currentIndex;

            if ($.isArray(valueSet)) {
                currentIndex = valueSet.indexOf(currentValue);
                if (currentIndex !== -1) {
                    return valueSet[(currentIndex + 1) % valueSet.length];
                }
            }
        }
    }
};