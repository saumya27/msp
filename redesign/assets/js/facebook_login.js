window.fbAsyncInit = function () {
    FB.init({
        //"appId" : '516534571724606',//mspdvid:'327375840708379', // App ID
        "appId" : '253242341485828',
        "channelUrl" : 'http://www.mysmartprice.com/users/fbchannel.html', // Channel File
        "status" : true, // check login status
        "cookie" : true, // enable cookies to allow the server to access the session
        "xfbml" : true  // parse XFBML
    });
};

// Load the SDK Asynchronously
(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));
   
	
function check_fb_login() {
	var email = '';
	//console.log('checking whether the user is logged into fb');
	FB.getLoginStatus(function (response) {
		if (response.status === 'connected') {
			update_f_data_login(response);
			$(".userinfo img:first-child").attr('src', 'http://graph.facebook.com/' + response.authResponse.userID + '/picture');
			//console.log('logged and connected');
		} else if (response.status === 'not_authorized') {
			//console.log('logged but not connected');
		} else {
			//console.log('not logged');
		}
	});
}
function fb_login() {
	var email='';
	//console.log('user wants to login with fb');
	FB.getLoginStatus(function (response) {
		if (response.status !== 'connected') {
			FB.login(function (response) {
				//console.log(response);
				if (response.authResponse) {
					//console.log('user logged in successfully');
					email = update_f_data_login(response);
					//loginme(email);
				} else {
					//console.log('user failed to login');
				}
			}, {
                "scope" : "email,user_birthday,user_likes,user_location,friends_likes,publish_actions"
            });
			//console.log('fb login completed successfully');
		} else {
    		//console.log('logged in and connected');
    		email = update_f_data_login(response);
		}
	});
}

function update_f_data_login(info){
    var email = '';
    
    $.ajax( {
        "url" : 'https://graph.facebook.com/me/?access_token=' + info.authResponse.accessToken, 
        "dataType" : "json"
    }).done(function (data) {
		email = data.email;
		//console.log('successfully got data', data);
		//console.log('email'+email);
		data['access_token'] = info.authResponse.accessToken;
		//console.log( 'success', data );
		$.ajax({
			"url" :'http://www.mysmartprice.com/users/facebook_submit.php',
			"type" : 'POST',
			"data" : {
                "fb" : data
            }
        }).done(function( response ){
			//console.log('logging in with '+email);
			loginme_by_fb(email,'http://graph.facebook.com/' + info.authResponse.userID + '/picture');
			$.get('http://www.mysmartprice.com/users/set_username_cookie.php',{email: email}, function(name){setCookie('msp_login_name', name, 365);});
			closePopup();
			//$(".userinfo img:first-child").attr('src','http://graph.facebook.com/' + info.authResponse.userID + '/picture');
			//console.log('successfully submitted data');
			//console.log(response);
			},
		}).fail(function( data ) { 
            //console.log( 'error in getting data', data ); 
		});
	});
	//console.log('returning email');
	return email;
}