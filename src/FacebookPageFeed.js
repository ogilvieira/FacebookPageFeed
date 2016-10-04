;(function(root) {
	'use strict';
	root.FacebookPageFeed = (function(defaultConfig){

		var obj = {};

		obj.config = {
			appid 	  	: null,
			pagename 	: null,
			token 		: null,
			feedlimit	: 10,
			format		: 'json', //json, html
			dateFormat 	: function(date){ return date; },
			likesFormat : function(likes){ return likes; },
			template: function(page, post){
				var tpl = "<div>"+post.message+" - "+((post.likes) ? post.likes.data.length : "0")+"</div>";
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
			defaultConfig = null;
		})();

		privateObj.fbIsInit = false;
		privateObj.queue = [];
		privateObj.urlify = function(text){
			text = text || "";
		    var urlRegex = /(https?:\/\/[^\s]+)/g;
		    return text.replace(urlRegex, function(url) {
		        return '<a href="' + url + '" target="_blank">' + url + '</a>';
		    });
		};

		privateObj.formatResponse = {};
		privateObj.formatResponse.json = function(data, config){
			var res = {};
			res.page = {
				name : data.name,
				likes : config.dateFormat(data.fan_count),
				link: data.link,
				cover: data.cover.source,
				avatar: data.picture.data.url
			};
			res.posts = data.posts.data;
			return res;
		};

		privateObj.formatResponse.html = function(data, config){
			data = privateObj.formatResponse.json(data, config);
			var html = '';
			for(var i in data.posts){
				data.posts[i].message = privateObj.urlify(data.posts[i].message);
				data.posts[i].likes = config.likesFormat((data.posts[i].likes) ? data.posts[i].likes.summary.total_count : 0);
				html += config.template(data.page, data.posts[i]);
			}
			return html;
		};



		privateObj.callFB = function(newConfig){
			FB.api("/"+newConfig.pagename, {
					access_token : newConfig.token,
					summary : true,
					fields :"picture{url},name,cover,fan_count,link,posts.limit("+newConfig.feedlimit+"){attachments, likes.limit(0).summary(true), message, created_time, link}"
				},
				function (response) {
					if (!response.error) {
						newConfig.onLoad(privateObj.formatResponse[newConfig.format](response, newConfig), newConfig.format, response);
					} else {
						newConfig.onLoad(response.error, 'json');
					}
				}
			);
		};

		window.fbAsyncInit = function() {
			FB.init({
			  appId      : obj.config.appid,
			  xfbml      : true,
			  version    : 'v2.6'
			});
			privateObj.fbIsInit = true;
			for(var i in privateObj.queue){
				privateObj.loadData(privateObj.queue[i]);
			}
		};

		privateObj.loadData = function(newConfig){
			privateObj.callFB(newConfig);
		};

		obj.get = function(newConfig){
			newConfig = newConfig || {};
					newConfig = privateObj.extend(obj.config, newConfig);
			if(!privateObj.fbIsInit){
					privateObj.queue.push(newConfig);
			} else {
				privateObj.loadData(newConfig);
			}
		};

		return obj;
	});
}(this));