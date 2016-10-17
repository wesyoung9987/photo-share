var app = angular.module('photoShare', ['ui.router']);

app.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  }

  o.getAll = function(){
    return $http.get('/photos').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post){
    return $http.post('/photos', post).success(function(data){
      o.posts.push(data);
    });
  };

  o.upvote = function(post){
    return $http.put('/photos/' + post._id + '/like').success(function(data){
      post.likes += 1;
    });
  };

  o.get = function(id){
    return $http.get('/photos/' + id).then(function(res){
      return res.data;
    });
  };

  o.addComment = function(id, comment){
    return $http.post('/photos/' + id + '/comments', comment);
  };

  o.upvoteComment = function(post, comment){
    return $http.put('/photos/' + post._id + /comments/ + comment._id + '/upvote').success(function(data){
      comment.upvotes += 1;
    });
  };

  return o;
}]);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }
      })
      .state('posts', {
        url: '/photos/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts){
            return posts.get($stateParams.id);
          }]
        }
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
    posts.create({
      title: $scope.title,
      link: $scope.link
    })
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementLikes = function(post){
    posts.upvote(post);
  };

}]);

app.controller('PostsCtrl', ['$scope', "posts", 'post', function($scope, posts, post){
    $scope.post = post;

    $scope.addComment = function(){
      if($scope.body === ''){
        return;
      }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user'
      }).success(function(comment){
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment){
      posts.upvoteComment(post, comment);
    };

}])








