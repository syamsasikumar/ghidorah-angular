;
var app = angular.module('Ghidorah', ['infinite-scroll']);

app.controller('FetchController', function($scope, SoccerFeed) {
  $scope.feed = new SoccerFeed();
  
  $scope.getDateTime = function(ts){
    var a = new Date( ts * 1000 );
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth() - 1];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  $scope.getIcon = function(type, source){
    switch (type){
      case 'live':
        return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425266/soccerball_cj9b77.png';
        break;
      case 'tweet':
        return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425580/Twitter_bird_icon_peslq4.png';
        break;
      case 'news':
        if(source == 'bbc'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425805/bbc-logo_jjwbow.png';
        }else if(source == 'guardian'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425902/guardian-icon_jw9ghq.png';
        }else if(source == 'sky'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406425988/sky_uk_sports_jjsl9d.png';
        }else if(source == 'dm'){
          return 'http://res.cloudinary.com/dtmnbo2hw/image/upload/v1406426078/daily-mail-logo_pmlkjw.png';
        }
        break;
    }
  }

  $scope.truncate = function(str, length){
    return (str.length > length) ? str.substr(0, length-1) + ' ...' : str;
  }
});

app.factory('SoccerFeed', function($http){
  var SoccerFeed = function(){
    this.items = [];
    this.wait = false;
    this.afterTs = 0;
    this.page = 1;
  }
  
  SoccerFeed.prototype.fetch = function(){
    if(this.wait){
      return;
    }
    this.wait = true;
    var url = "http://gamera.herokuapp.com/feeds?";
    $http({
      url: url + 'after_ts=' + this.afterTs + '&page=' + this.page, 
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