;
var app = angular.module('Ghidorah', ['infinite-scroll']);

app.controller('FetchController', function($scope, SoccerFeed) {
  $scope.feed = new SoccerFeed();
  $scope.search = '';
  
  $scope.getDateTime = function(ts){
    var stamp = 'AM';
    var a = new Date( ts * 1000 );
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth() - 1];
    var date = a.getDate();
    var hour = a.getHours();
    if(hour > 12){
      hour -= 12;
      stamp = 'PM';
    }
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + ':' + sec + ' ' + stamp;
    return time;
  }

  $scope.filter = function(){
    $scope.feed.flush();
    $scope.feed.setSearch($scope.search);
    $scope.feed.fetch();
  }
  
  $scope.checkEnter = function(keyEvent) {
    if (keyEvent.which === 13)
      alert('Im a lert');
  }

  $scope.getIcon = function(type, source){
    switch (type){
      case 'live':
        return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425266/soccerball_cj9b77.png';
        break;
      case 'tweet':
        return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406521848/Logo_twitter_wordmark_1000_uormkh.png';
        break;
      case 'news':
        if(source == 'bbc'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425805/bbc-logo_jjwbow.png';
        }else if(source == 'guardian'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406521979/guard_qjpgko.png';
        }else if(source == 'sky'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425988/sky_uk_sports_jjsl9d.png';
        }else if(source == 'dm'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406426078/daily-mail-logo_pmlkjw.png';
        }else if(source == 'times'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406522282/times_hhhuhb.png';
        }
        break;
    }
  }

  $scope.getDefaultImage = function(){
    return "http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406589133/soccer-02_1_c3w9ww.jpg";
  }

  $scope.tabClick = function(type){
    $scope.search = "";
    $scope.feed.flush();
    $scope.feed.setType(type);
    $scope.feed.fetch();
  }

  $scope.truncate = function(str, length){
    return (str.length > length) ? str.substr(0, length-1) + ' ...' : str;
  }
});

app.factory('SoccerFeed', function($http){
  var SoccerFeed = function(){
    this.url = 'http://gamera.herokuapp.com/feeds?';
    this.items = [];
    this.wait = false;
    this.afterTs = 0;
    this.page = 1;
    this.type = 'all';
    this.search = '';
  }
  
  SoccerFeed.prototype.flush = function(){
    this.items = [];
    this.afterTs = 0;
    this.page = 1;
    this.search = '';
  }

  SoccerFeed.prototype.setType = function(type){
    this.type = type;
  }

  SoccerFeed.prototype.setSearch = function(search){
    this.search = search;
  }

  SoccerFeed.prototype.fetch = function(){
    var type = this.type;
    if(this.wait){
      return;
    }
    url_params = '';
    if(type == 'tweet'){
      url_params += '&hide_live=1&hide_news=1';
    }else if(type == 'news'){
      url_params += '&hide_live=1&hide_tweet=1'
    }else if(type == 'live'){
      url_params += '&hide_tweet=1&hide_news=1'
    }

    if(this.search.trim() != ''){
      url_params += '&search=' + this.search;
    }
    this.wait = true;
    $http({
      url: this.url + 'after_ts=' + this.afterTs + '&page=' + this.page + url_params, 
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=UTF-8'}
    })
    .success(function(data) {
      for (var i = 0; i < data.length; i++) {
        this.items.push(data[i]);
      }
      if(this.items.length > 0){
        this.afterTs = this.items[0].date;
      }
      this.page++;
      this.wait = false;
    }.bind(this));
  }

  return SoccerFeed;
})