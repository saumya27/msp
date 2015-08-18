MSP = {
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
                    "number" : '^\\d+$',
                    "email" : '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
                },
                "messages" : {
                    "number" : "Please enter a valid number.",
                },
                "testPattern" : function(type, value) {
                    var result = {},
                        status = this._regex[type].test(value);
                    result.status = status;
                    if (status) result.message = this._messages[type]; 
                    return result;
                }
            },
            "text" : function (value, options) {
                var isWithinLimits = (function() {
                    var result = true;
                    if (options && options.min && value < options.min) {
                        result = false;
                    }
                    if (options && options.max && value > options.max) {
                        result = false;
                    }
                    return result;
                }());
                return this._.testPattern("text", value) && value && isWithinLimits;
            },
            "number" : function(value) {
                return this._.testPattern("number", value);
            },
            "email" : function() {
                return this._.testPattern("email", value);
            },
            /** MSP.utils.validate.form
            * "formData" argument format
            *   [{
            *       "type" : "email",     // required Argument
            *       "value" : "a@a.com",  // required Argument
            *       "errorNode" : $(".field_error_message") // optional Argument
            *   }, .....]
            */
            "form" : function(formData) {
                var isValid = true,
                    check = this;

                $.each(formData, function(i, field) {
                    var result = check[field.type](field.value);
                    if (result.status === false) {
                        if (field.errorNode instanceof jQuery) {
                            field.errorNode.text(result.message);
                        } else {
                            alert(result.message);
                        }
                        isValid = false;
                    }
                });
                return isValid;
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
        }
    }
}
