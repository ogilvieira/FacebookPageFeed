var elResult = $('#result'),
    elCustomize = $('#customize'),
    urlToJson = function(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}

var fbFeed = new FacebookPageFeed({
    appid : '426407340854185',
    token : '426407340854185|1VWJq1dpLbDNBN-VCoKsekzl0g8',
    pagename : 'FacebookforDevelopers',
    format: 'html',
    feedlimit : 5,
    template: function(page, post){

      var postBody = '';
      postBody = '{{cover}}{{text}}';
      postBody = postBody.replace("{{cover}}", '<a href="'+post.link+'" target="_blank"><img src="'+post.attachments.data[0].media.image.src+'" class="img-responsive"></a>');
      postBody = postBody.replace("{{text}}", '<p class="card-text">'+privateObj.urlify(post.message)+'</p>');

      var tpl = '\
        <div class="card card-block">\
          <div class="panel-heading"">\
            <div class="media">\
              <div class="media-left">\
                <a href="'+page.link+'" target="_blank"><img src="'+page.avatar+'"></a>\
              </div>\
              <div class="media-body">\
                <h4 class="media-heading"><a href="'+page.link+'" target="_blank">'+page.name+'</a><br><small>'+page.likes+' likes</small>\</h4>\
                <a href="'+post.link+'" target="_blank" class="date">'+post.created_time+'</a>\
              </div>\
            </div>\
          </div>\
          <div class="panel-body">'+postBody+'</div>\
          <div class="panel-footer">\
            <a href="'+post.link+'" class="label label-danger" target="_blank">'+((post.likes) ? post.likes.data.length : "0")+' likes</a>\
          </div>\
        </div>';

      return tpl;
    },
    onLoad: function(res, format, data){
      if(data && data.cover){
        $('.jumbotron').css({'background-image' : 'url(\''+data.cover.source+'\')'});
      } else {
        $('.jumbotron').css({'background-image' : ''});
      }
      if(format == 'html'){
        elResult.html('<div class="card-columns">'+res+'</div>');
      } else {
        elResult.html('<pre>'+JSON.stringify(res, null, 2)+'</pre>');
      }
    }
});
fbFeed.get();

elCustomize.find('.btn').on('click', function(e){
  e.preventDefault();
  fbFeed.get(urlToJson(elCustomize.serialize()));
});

// fbFeed.get();
