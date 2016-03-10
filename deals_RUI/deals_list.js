$(window).scroll(function() {
    set_position_property();
});

function set_position_property() {
    var $top_nav = $('.page-nvgtn__dls-wrpr'),
        $window_top = $(window).scrollTop(),
        pos = $top_nav.position().top;
    if ($window_top <= 0) {
        $top_nav.css('position', 'absolute');
        $top_nav.css('top', '100px');
    } else if ($window_top < 60) {
        $top_nav.css('top', pos);
        $top_nav.css('position', 'absolute');
    } else {
        $top_nav.css('position', 'fixed');
        $top_nav.css('top', '40px');
    }

    if ($window_top > 20) {
        $('.sub-hdr').addClass('frc-hide');
    } else {
        $('.sub-hdr').removeClass('frc-hide');
    }
}

$(document).on('click', '.js-load-more', function() {
    var $this = $(this);
    var section_items = $this.parent().find('.sctn-dls');
    $this.html('Loading..');
    var type = section_items.data('dealtype');
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

setTimeout(function() {
    $('.prdct-item--dls__exprs-tdy--expnd').each(function() {
        $(this).removeClass('prdct-item--dls__exprs-tdy--expnd');
    });
}, 5000);

;
(function() {
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

$('.sdbr-list-prdcts').each(function() {
    var $catname = $(this).attr('data-cat');
    expandList($catname);
});

$('body').on('click', '.sdbr-list-prdcts .sctn__view-all', function() {
    var $catname = $(this).closest(".sdbr-list-prdcts").attr('data-cat');
    expandList($catname);
    return false;
});

function expandList(catname) {
    var $sidebardiv = $('.sdbr-list-prdcts[data-cat="' + catname + '"]'),
        $expand = $sidebardiv.find('.sctn__view-all'),
        $listItems = $sidebardiv.find(".sdbr-list__item"),
        settings = {
            "display": 7,
            "signs": ["+", "-"],
            "labels": ["View More", "View Less"]
        };
    if ($listItems.length > settings.display) {
        $listItems.slice(settings.display).toggle();
        $expand.text(settings.signs[status]);
        $expand.text(settings.labels[status]);
    } else {
        $expand.hide();
        $sidebardiv.addClass("noSublist");
    }
}
