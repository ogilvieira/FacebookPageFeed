# FacebookPageFeed.js

A simple javascript class that returns the feed of a specific page

```javascript
var fbFeed = new FacebookPageFeed({
	'appid'		: 'YOUR_APPID',
	'token'		: 'YOUR_APP_TOKEN',
	'pagename'	: 'PAGENAME_OR_PAGEID',
	'feedlimit'	: 10
}, function( posts, pageinfo ){
	//magic here
});
```
## what you need before use it
* [A Facebook App](https://developers.facebook.com/apps/)
* App ID
* [App Token](https://developers.facebook.com/tools/accesstoken/)
* [Graph API Javascript SDK](https://developers.facebook.com/docs/javascript/quickstart)
