var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('App listening on port ' + port);
});
