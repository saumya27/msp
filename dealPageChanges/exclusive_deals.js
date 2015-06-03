
$(document).ready(function() {
    // $('body').on('click', '.close', function() {
    //     setCookie('NSsDone', '0', 7);
    //     $(this).closest('.subscribe-email-wrap').fadeOut(300, function() {
    //     });
    //     $(this).closest('.coupon-email-wrap').fadeOut(300, function() {
    //     });
    //     location.reload();
    // });
    // $('#coupon-email-submit').click(function(e) {
    //     e.preventDefault();
    //     alert("Thank You! Check your Inbox for Coupon Code.");
    //     setTimeout(function() {
    //         $('.box .close').click();
    //     }, 3000);
    // });

    var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    if (isChrome) {
        /* the span#plugin_id gets added to DOM apprx in 2 sec after clicking on 'Add to Chrome', so timeout */
        var startTime = new Date().getTime(); 
        var interval = setInterval(function() {
            if (new Date().getTime() - startTime > 3000) {
                clearInterval(interval);
                return;
            }
            if (!$(".plugin_id").length) {
                $(".chrome_install_offer").on('click', function() {
                    tryInstallExtension("Plugin_Popup", "Deals_Exclusive", function() {
                        show_coupon_popup();
                    }, undefined);
                });
                $(".show-without-plugin").show();
            } else {
                $(".chrome_install_offer").val("Grab the Deal").on('click', function() {
                    show_coupon_popup();
                });
                $(".show-without-plugin").hide();
                clearInterval(interval);
                return;
            }
        }, 1000);
    } else {
        $(".chrome_install_offer").val("Grab The Deal on Chrome").attr('disabled','disabled');
        $(".show-without-plugin").show();
    }
});