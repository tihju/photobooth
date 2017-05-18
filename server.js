var express = require("express");
var formidable = require('formidable');

var app = express();

app.use(express.static('public'));

app.get('/query', function(request, response) {
  console.log("query");
  query = request.url.split("?")[1]; // get query string
  if (query) {
    answer(query, response);
  } else {
    sendCode(400, response, 'query not recognized');
  }
});

app.post('/', function(request, response) {
  var form = new formidable.IncomingForm();
  form.parse(request); // figures out what files are in form

  // callback for when a file begins to be processed
  form.on('fileBegin', function(name, file) {
    // put it in /public
    file.path = __dirname + '/public/' + file.name;
    console.log("uploading ", file.name, name);
  });

  // callback for when file is fully recieved
  form.on('end', function() {
    response.status(201);
    response.send("recieved file"); // respond to browser
  });

});



//app.get();

app.listen(10316);
