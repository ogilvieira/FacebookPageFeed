# FacebookPageFeed.js [DEMO](http://ogilvieira.com.br/FacebookPageFeed/)

A simple javascript class that returns the feed of a specific page

```javascript
//initialize and set defaults
var fbFeed = new FacebookPageFeed({
	'appid'		: 'YOUR_APPID',
	'token'		: 'YOUR_APP_TOKEN',
	'pagename'	: 'PAGENAME_OR_PAGEID',
	'feedlimit'	: 10,
	'format' 	: 'html', //json,
	'dateFormat': function(date){
		return date; //format date string with moment.js or others...
	},
	'likesFormat': function(likes){
		return likes; //format likes number...
	},
	'template' : function(page, post){
  	//console.log(page, post);
  	var tpl = '<h1>'+page.name+'</h1>';
  	    tpl += '<p>'+post.message+'</p>';
  	return tpl;
	},
	onLoad: function(res){
	  console.log(res); //the result
	}
});

fbFeed.get(); //work's!

fbFeed.get({
  pagename: 'FacebookforDevelopers',
  feedlimit: 30,
  format: 'json'
}); //reload with new settings

```
## what you need before use it
* [A Facebook App](https://developers.facebook.com/apps/)
* App ID
* [App Token](https://developers.facebook.com/tools/accesstoken/)
* [Graph API Javascript SDK v2.6](https://developers.facebook.com/docs/javascript/quickstart)

