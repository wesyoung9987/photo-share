var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
  title: String,
  link: String,
  likes: {type:Number, default: 0},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

PhotoSchema.methods.like = function(cb) {
  this.likes += 1;
  this.save(cb);
};

mongoose.model('Photo', PhotoSchema);