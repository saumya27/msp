MSP = {
    "dataPoints" : {
        headerHeight : $(".hdr-size").height()
    },
    "utils" : {
        "throttle" : function(fn, timeout, ctx) {
            var timer, args, needInvoke;
            return function() {
                args = arguments;
                needInvoke = true;
                ctx = ctx || this;
                if(!timer) {
                    (function() {
                        if(needInvoke) {
                            fn.apply(ctx, args);
                            needInvoke = false;
                            timer = setTimeout(arguments.callee, timeout);
                        } else {
                            timer = null;
                        }
                    })();
                }
            };
        },
        "debounce" : function(fn, timeout, invokeAsap, ctx) {
            if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
                ctx = invokeAsap;
                invokeAsap = false;
            }
            var timer;
            return function() {
                var args = arguments;
                ctx = ctx || this;
                invokeAsap && !timer && fn.apply(ctx, args);
                clearTimeout(timer);
                timer = setTimeout(function() {
                    !invokeAsap && fn.apply(ctx, args);
                    timer = null;
                }, timeout);
            }
        },
        /** 
         * method calls format.
         * MSP.utils.url.from.bgImage()
         */
        "urlFrom" : {
            "bgImage" : function(bgProp) {
                bgProp.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            }
        },
        "parse" : {
            "numberFrom" : {
                "price" : function(price) {
                    return parseInt(price.replace(/\D/g, ""), 10);
                }
            }
        },
        "validate" : {
            "_" : {
                "regex" : {
                    "text" : (new RegExp('^[a-zA-Z\\d\\-_,.\\s]+$', "i")),
                    "number" : '^\\d+$',
                    "email" : '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
                },
                "testPattern" : function(type, value) {
                    var result = (new RegExp(this.regex[type])).test(value);
                    
                    return result;
                }
            },
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
                return this._.testPattern("text", $.trim(value)) && value && isWithinLimits;
            },
            "number" : function(value, options) {
                return this._.testPattern("number", value);
            },
            "email" : function(value, options) {
                return this._.testPattern("email", value);
            },
            /** MSP.utils.validate.form
            * "formData" argument format
            *   [{
            *       "type" : "email",                 // required Argument
            *       "inputField" : $('.form-inpt'),   // required Argument
            *       "errorNode" : $(".js-vldtn-err"), // optional Argument
            *       "options" : {                     // optional Argument
            *           "min" : "5",
            *           "max" : "10"
            *       }
            *   }, .....]
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
        },
        /**
         * memoize(fn[, options]) -> returns a new function which memoizes return values for given args.
         * Arguments:
         * 1. fn: -> function to be memoized. (pass function's promise if it is async).
         * 2. options: {
         *   isAsync -> (boolean), if function to be memoized is async.
         *   cacheLimit -> (integer), max no. of results that can be stored in cache.
         * }
         */
        "memoize" : function _memoize(fn, options) {
            var memoizeCache = _memoize._cache_ || {},
                isAsync = options && options.isAsync === true,
                cacheLimit = options && options.cacheLimit,
                resultFn;

            memoizeCache[fn.toString()] = { "queries" : [], "results" : [] };
            if (isAsync) {
                resultFn = function _memoizedFn() {
                    var cache = memoizeCache[fn.toString()],
                        dfd = $.Deferred(),
                        query = JSON.stringify(arguments),
                        result;
                  
                    if (cache.queries.indexOf(query) !== -1) {
                        result = cache.results[cache.queries.indexOf(query)];
                        dfd.resolve(result);
                    } else {
                        fn.apply(this, arguments).done(function (result){
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
            } else {
                resultFn = function _memoizedFn() {
                    var cache = memoizeCache[fn.toString()],
                        query = JSON.stringify(arguments),
                        result;
                  
                    if (cache.queries.indexOf(query) !== -1) {
                        result = cache.results[cache.queries.indexOf(query)];
                        return result;
                    } else {
                        result = fn.apply(this, arguments);
                        cache.queries.push(query);
                        cache.results.push(result);
                        if (cacheLimit) {
                            if (cache.queries.length > cacheLimit) {
                                cache.queries.shift();
                                cache.responses.shift();
                            }
                        }
                        return result;
                    }
                };
            }
            return resultFn;
        },
        "lazyLoad" : {
            "run" : function() {
                for (i = 0; i < this.queue.length; i++) {
                    (function(lazyLoad) {
                        var callback = lazyLoad.queue[i].callback,
                            position = lazyLoad.queue[i].position;
                            triggerPoint = (position || lazyLoad.queue[i].node.offset().top) - $(window).height();

                        if ($win.scrollTop() > triggerPoint) {
                            callback.definition.apply(callback.context, callback.arguments);
                            lazyLoad.queue.splice(i, 1);
                            i--;
                        }
                    }(this));
                }
            },
            "queue" : [],
            /**
             * MSP.utils.lazyLoad.assign => accepts a task to be executed on reaching scroll position of given node.
             * {
             *      "node" : $node, // jquery node
             *      "isStaic" : true // boolean
             *      "callback" : {
             *          "definition" : callbackFunction, // defintion of the task to be run
             *          "context" : this,
             *          "arguments" : [args,...] // arguments of the task if any.
             *      }
             * }
             */
            "assign" : function(task) {
                if (task.isStatic) {
                    task.position = task.node.offset().top;
                }
                this.queue.push(task);
                return this;
            }
        },
        "browser" : {
            "name" : (function() {
                var result = null,
                    ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("chrome") !== -1 && ua.indexOf("opr") === -1) {
                    result = "chrome";
                } else if (ua.indexOf("firefox") !== -1) {
                    result = "firefox";
                } else if (ua.indexOf("msie") !== -1 && ua.indexOf("trident") !== -1 && ua.indexOf("edge") !== -1) {
                    result = "MSIE";
                }
                return result;
            }()),
            "version" : (function() {
                var userAgent = navigator.userAgent.toLowerCase();
                return (/msie/.test(userAgent) ? (parseFloat((userAgent.match(/.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/) || [])[1])) : null);
            }())
        },
        "rotateValue" : function(valueSet, currentValue) {
            var currentIndex
            if ($.isArray(valueSet)) {
                currentIndex = valueSet.indexOf(currentValue);
                if (currentIndex !== -1) {
                    return valueSet[(currentIndex + 1) % valueSet.length];
                }
            }
        }
    }
}
