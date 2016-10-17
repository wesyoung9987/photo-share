var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('./models/Photo');
require('./models/Comment');
var Photo = mongoose.model('Photo');
var Comment = mongoose.model('Comment');

var dbURI = process.env.MONGODB_URI || 'mongodb://localhost/photoshare';

mongoose.connect(dbURI);
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('App listening on port ' + port);
});

app.get('/photos', function(req, res, next){
  Photo.find(function(err, photos){
    if(err){
      return next(err);
    } else {
      res.json(photos);
    }
  });
});

app.post('/photos', function(req, res, next){
  var photo = new Photo(req.body);

  photo.save(function(err, photo){
    if(err){
      return next(err);
    } else {
      res.json(photo);
    }
  });
});

app.param('photo', function(req, res, next, id) {
  var query = Photo.findById(id);

  query.exec(function (err, photo){
    if(err){
      return next(err);
    }
    if(!photo){
      return next(new Error('can\'t find photo'));
    }

    req.photo = photo;
    return next();
  });
});

app.get('/photos/:photo', function(req, res, next){
  req.photo.populate('comments', function(err, photo){
    if(err){
      return next(err);
    }
    res.json(photo);
  });
});

app.put('/photos/:photo/like', function(req, res, next) {
  req.photo.like(function(err, photo){
    if(err){
      return next(err);
    }

    res.json(photo);
  });
});

app.post('/photos/:photo/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.photo = req.photo;

  comment.save(function(err, comment){
    if(err){
      return next(err);
    }

    req.photo.comments.push(comment);
    req.photo.save(function(err, post) {
      if(err){
        return next(err);
      }

      res.json(comment);
    });
  });
});

app.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if(err){
      return next(err);
    }
    if(!comment){
      return next(new Error('can\'t find comment'));
    }

    req.comment = comment;
    return next();
  });
});

app.put('/photos/:photo/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if(err){
      return next(err);
    }

    res.json(comment);
  });
});


