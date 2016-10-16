var app = angular.module('photoShare', ['ui.router']);

app.factory('posts', [function(){
  var postsObject = {
    posts: []
  }
  return postsObject;
}]);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
      })

    $urlRouterProvider.otherwise('home');
}]);

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
  $scope.posts = posts.posts.reverse();

  $scope.addPost = function(){
    if(!$scope.title || $scope.title === ''){
      return;
    }
    if(!$scope.link || $scope.link === ''){
      return;
    }
    $scope.posts.push({title: $scope.title, link: $scope.link, likes: 0, comments: [], date: new Date()});
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementLikes = function(post){
    post.likes += 1;
  };

}]);

app.controller('PostsCtrl', ['$scope', "$stateParams", 'posts', function($scope, $stateParams, posts){
    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function(){
      if($scope.body === ''){
        return;
      }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        likes: 0
      });
      $scope.body = '';
    };

}])








