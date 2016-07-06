var FacebookPageFeed = (function(defaultConfig){

	var obj = {};

	obj.config = {
		appid 	  : null,
		pagename 	: null,
		token 		: null,
		feedlimit	: 10,
		format	: 'json', //json, html
		template: function(page, post, postBody){
			var tpl = '\
				<div class="card card-block">\
					<div class="panel-heading" style="background-image: url(\''+page.cover+'\')">\
						<div class="media">\
							<div class="media-left">\
								<a href="'+page.link+'" target="_blank" style="background-image: url(\''+page.avatar+'\'); background-size: cover;"><img src="'+page.avatar+'"></a>\
							</div>\
							<div class="media-body">\
								<h4 class="media-heading"><a href="'+page.link+'" target="_blank">'+page.name+'</a><br><small>'+page.likes+' likes</small>\</h4>\
								<a href="'+post.link+'" target="_blank" class="date">'+post.created_time+'</a>\
							</div>\
						</div>\
					</div>\
					<div class="panel-body">'+postBody+'</div>\
					<div class="panel-footer">\
						<a href="'+post.link+'" class="label label-danger" target="_blank">'+post.likes.data.length+' likes</a>\
					</div>\
				</div>';

			return tpl;
		},
		onLoad: function(res){
			console.log(res);
		},
	};


	var privateObj = {};
	privateObj.extend = function(){
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }

    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;
	};

	(function(){
		obj.config = privateObj.extend(obj.config, defaultConfig);
		delete defaultConfig;
	})();

	privateObj.fbIsInit = false;
	privateObj.queue = [];
	privateObj.urlify = function(text){
		var text = text || "";
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
	};

	privateObj.formatResponse = {};
	privateObj.formatResponse['json'] = function(data){
		var res = {};
		res.page = {
			name : data.name,
			likes : data.fan_count,
			link: data.link,
			cover: data.cover.source,
			avatar: data.picture.data.url
		};
		res.posts = data.posts.data;
		return res;
	};

	privateObj.formatResponse['html'] = function(data, template){
		var data = privateObj.formatResponse['json'](data);
		var html = '';
		var postBody = '';
		for(var i in data.posts){
			postBody = '{{cover}}{{text}}';
			postBody = postBody.replace("{{cover}}", '<a href="'+data.posts[i].link+'" target="_blank"><img src="'+data.posts[i].attachments.data[0].media.image.src+'" class="img-responsive"></a>');
			postBody = postBody.replace("{{text}}", '<p class="card-text">'+privateObj.urlify(data.posts[i].message)+'</p>');

			html += template(data.page, data.posts[i], postBody);
		};
		return html;
	};



	privateObj.callFB = function(newConfig){
		FB.api("/"+newConfig.pagename, {
				access_token : newConfig.token,
				summary : true,
				fields :"picture{url},name,cover,fan_count,link,posts.limit("+newConfig.feedlimit+"){attachments, likes, message, created_time, link, reactions}"
			},
			function (response) {
				if (!response.error) {
					console.log(response);
					newConfig.onLoad(privateObj.formatResponse[newConfig.format](response, newConfig.template), newConfig.format);
				} else {
					newConfig.onLoad(response.error, 'json');
				}
			}
		);
	}

	window.fbAsyncInit = function() {
		FB.init({
		  appId      : obj.config.appid,
		  xfbml      : true,
		  version    : 'v2.6'
		});
		privateObj.fbIsInit = true;
		for(var i in privateObj.queue){
			privateObj.loadData(privateObj.queue[i]);
		};
	};

	privateObj.loadData = function(newConfig){
		privateObj.callFB(newConfig);
	};

	obj.get = function(newConfig){
		var newConfig = newConfig || {};
				newConfig = privateObj.extend(obj.config, newConfig);
		if(!privateObj.fbIsInit){
				privateObj.queue.push(newConfig);
		} else {
			privateObj.loadData(newConfig);
		}
	};

	return obj;
});
