$(document).ready( function(){

 // For filling the pie : START
    var score;
     $(".cmpr .pie-score").each( function(){   // for the overall score pie
        score = $(this).data("score");
        $(this).find(".pie__score").html(score);

        $(this).find(".left-side").css('transform','rotate(' + score*3.6 + 'deg) '); //left rotate
        $(this).find(".left-side").css('-ms-transform', 'rotate(' + score*3.6 + 'deg) '); // for IE8

        if(score >= 50){
            $(this).find(".pie").addClass("keep-left-pie");  // pie left dont clip          
            $(this).find(".right-side").css('transform', 'rotate(180deg) ');//right rotate 180 deg
        }else{
            $(this).find(".right-side").css("display","none");  // right side dont display
        }

        switch(score) {
            case checkRange(score, 0, 20):
                $(this).find(".half-circle").css('border-color', '#cc0000'); 
                break;
            case checkRange(score, 20, 40):
                $(this).find(".half-circle").css('border-color', '#f57900'); 
                break;
            case checkRange(score, 40, 60):
                $(this).find(".half-circle").css('border-color', '#e8d700'); 
                break;
            case checkRange(score, 60, 80):
                $(this).find(".half-circle").css('border-color', '#73d216'); 
                break;
            case checkRange(score, 80, 100):
                $(this).find(".half-circle").css('border-color', '#4e9a06'); 
                break;    
            default:
                $(this).find(".half-circle").css('border-color', '#4e9a06'); 
        }

        function checkRange(score, min, max) {
            if (score >= min && score < max) { return score; }
            else { return !score; }
        }

     })
});
