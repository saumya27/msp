// define('[TagExpansion]',function() {   
// });

$(document).on('click', '.js-load-more', function() {
    var $this = $(this);
    var section_items = $this.parent().find('.sctn-dls');
    $this.html('Loading..');
    var type = section_items.data('dealType');
    var current_shown_deals = [];
    // loadmore analytics
    // section_items.children('.sectionitem').each(function(){
    $('.prdct-item').each(function() {
        current_shown_deals.push($(this).data('dealid'));
    });
    // run ajax request
    $.post("/deals/more_deals.php", {
        type: type,
        have: current_shown_deals
    }, function(data) {
            data = jQuery.parseJSON(data);
            if (data.items != "") {
                section_items.append(data.items);
            }
            if (data.hasMore) {
                $this.html('View More Deals');
            } else {
                $this.hide();
            }
        })
});

setTimeout(function(){
    $('.prdct-item--dls__exprs-tdy--expnd').each(function() {
        $(this).removeClass('prdct-item--dls__exprs-tdy--expnd');
    });
}, 5000);

;(function(){
    var dealid_max = -1;
    $('.prdct-item--dls__new-tag').hide();
    $('.prdct-item').each(function() {
        if ($(this).data('dealid') > dealid_max) {
            dealid_max = $(this).data('dealid');
        }
    });
    var last_dealid = getCookie("last_dealid");
    if (typeof(last_dealid) !== 'undefined') {
        $('.prdct-item').each(function() {
            if ($(this).data('dealid') > last_dealid) {
                $(this).find('.newsince').show();
            }
        });
    } else {
        last_dealid = -1;
    }
    if (dealid_max > last_dealid) {
        last_dealid = dealid_max;
        setCookie("last_dealid", last_dealid, 30);
    }
}());
