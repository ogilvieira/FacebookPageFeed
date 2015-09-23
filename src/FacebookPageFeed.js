var FacebookPageFeed =  function( params, callback ){
	var that = this;
	that.callback = callback; 
	that.options = {
		appid 	  	: params.appid,
		pagename 	: params.pagename,
		token 		: params.token,
		feedlimit	: params.feedlimit || 10
	};

	that.loadData = function(){

		window.fbAsyncInit = function() {

			FB.init({
			  appId      : that.options.appid,
			  xfbml      : true,
			  version    : 'v2.4'
			});

			FB.api("/"+that.options.pagename, {
		    	access_token : that.options.token,
		    	"fields":"feed.limit("+that.options.feedlimit+"){attachments, likes, message, created_time, link},picture{url},name"
			    },
			    function (response) {
			    	if (!response.error) {
			    		return that.formatResponse( response );
					} else {
			    		console.error( response.error );
					}
			    }
		    );
		};
	};

	that.formatResponse = function( response ){
		that.wallresult = {};
		that.wallresult.feed = [];
		that.wallresult.page = {
			page_picture : response.picture.data.url,
			page_name 	 : response.name
		};

		console.log()

		for (var i = 0, len = response.feed.data.length; i < len; i++ ){
			var node = {};
			var val = response.feed.data[i];

			node.post_text = val.message || '';
			node.likes = val.likes === undefined ? 0 : val.likes.data.length;
			node.post_cover = false;
			node.post_link = val.link;
			if( val.attachments !== undefined ) {
				if( val.attachments.data[0].media.image ){
					node.post_cover = val.attachments.data[0].media.image.src;
				}
			}

			node.post_created_time = val.created_time;
			that.wallresult.feed.push( node );
		}

		that.callback( that.wallresult.feed, that.wallresult.page );
	};

	that.init = function(){
		that.loadData();
	}();
};