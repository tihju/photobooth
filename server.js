/* use the express framwork */
var express = require("express");

//for parsing forms and reading in the images
var formidable = require('formidable');

//make a new express server object
var app = express();

//static files
app.use(express.static('public'));

//queries
app.get('/query', function(request, response) {
  console.log("query");
  query = request.url.split("?")[1]; // get query string
  if (query) {
    answer(query, response);
  } else {
    sendCode(400, response, 'query not recognized');
  }
});

//upload images
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


//making a database
var sqlite3 = require("sqlite3").verbose(); //use sqlite
var dbFile = "photos.db";

//makes the object that represents the database in our code
var db = new sqlite3.Database(dbFile);

// If not, initialize it
var cmdStr = "CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)"

db.run(cmdStr);


