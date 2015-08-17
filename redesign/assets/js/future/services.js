MSP.services = {
    "chromePlugin" : {
        "isInstalled" : function() {
            var dfd = $.Deferred(),
                pluginPresent = false,
                pluginTimeout = setInterval(checkPlugin, 1000);

            setTimeout(function() {
                clearInterval(pluginTimeout);
                if (!pluginPresent) {
                    dfd.reject("failed!");
                }
            }, 3000);

            function checkPlugin() {
                pluginPresent = !(!$(".plugin_id").length);
                if (pluginPresent) {
                    clearInterval(pluginTimeout);
                    dfd.resolve("success!");
                    return;
                }
            }
            return dfd.promise();
        },
        /** 
        * options is a object literal
        * {
        *   "gaLabel" : <value>
        * }
        * 
        */
        "install" : function(options) {
            var dfd = $.Deferred();
            try {
                if (chrome && chrome.webstore) {
                    if (!$("link[rel='chrome-webstore-item']").length) {
                        $("head").append("<link rel='chrome-webstore-item' href='" + CHROME_EXT_INSTALL_URL + "'/>");
                    }
                    chrome.webstore.install(CHROME_EXT_INSTALL_URL, function() {
                        if(_gaq) _gaq.push(["_trackEvent", "Chrome_Plugin", "Installed", options.gaLabel || ""]);
                        dfd.resolve();
                    }, function() {
                        dfd.reject();
                    });
                } else {
                    dfd.reject();
                }
            } catch (e) {
                dfd.reject();
            }
            return dfd.promise();
        }
    },
    "firefoxPlugin" : {
        "install" : function() {
            var params = {
                "MySmartPrice": {
                    URL: "https://addons.mozilla.org/firefox/downloads/file/326228/mysmartprice-0.20-fx.xpi",
                    IconURL: "http://9f5a4ac1427830485fea-b66945f48d5da8582d1654f2d3f9804f.r55.cf1.rackcdn.com/logo-icon.png",
                    Hash: "sha1:9F8FB2019911772CEF8EB3A913588C70C5272004",
                    toString: function () {
                        return this.URL;
                    }
                }
            };
            window.InstallTrigger.install(params);
        }
    }
};

//function tryInstallChrome(gaLabel, successCallback, failCallback) {