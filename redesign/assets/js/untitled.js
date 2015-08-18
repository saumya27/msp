function memoize(fn, options) {
    var memoizeCache = memoize._cache_ || {},
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
}

var delayed = memoize(function(msg) {
    var dfd = $.Deferred();
    setTimeout(function(){
        dfd.resolve(msg);
    }, 2000);
    return dfd.promise();
});

delayed("hello").done(function(result){
    console.log(result);
    delayed("hello").done(function(result){
       console.log(result);
    });
});