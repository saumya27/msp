
$(document).ready(function() {
    var isPluginInstalled;

    var pluginTimeout = setInterval(checkPlugin,1000);
    setTimeout(function(){
        clearInterval(pluginTimeout);
    },3000);

    var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    if (isChrome) {
                $(".chrome_install").on('click', function() {
                    if (!isPluginInstalled) {
                         chrome.webstore.install("https://chrome.google.com/webstore/detail/bofbpdmkbmlancfihdncikcigpokmdda", function() {                          
                           isPluginInstalled = true; 
                           openPopup($(".chrome_install").val("Grab the Deal").data('href'));
                            $(".show-without-plugin").hide();
                        }, undefined);
                        $(".show-without-plugin").show();
                    }
                 else {
                    $(".show-without-plugin").hide();
                    openPopup($(this).data('href'));
                    }
                });
    } else {
        $(".chrome_install").val("Grab The Deal on Chrome").attr('disabled','disabled');
        $(".show-without-plugin").show();
    }

    function checkPlugin(){
        isPluginInstalled = !(!$(".plugin_id").length);
        if(isPluginInstalled) {
             $(".show-without-plugin").hide();
             $(".chrome_install").val("Grab the Deal");

            clearInterval(pluginTimeout);
            return;
        }
    }

});

    