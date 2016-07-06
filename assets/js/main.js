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
