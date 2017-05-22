portNum = 10316
/* use the express framwork */
var express = require("express");

//for parsing forms and reading in the images
var formidable = require('formidable');

//making database
var sqlite3 = require("sqlite3").verbose(); // use sqlite
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);
var cmdStr = "CREATE TABLE IF NOT EXISTS Photobooth (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)"
db.run(cmdStr, errorCallback);


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
  var fileName = "";
  form.parse(request); // figures out what files are in form

  // callback for when a file begins to be processed
  form.on('fileBegin', function(name, file) {
    // put it in /public
    file.path = __dirname + '/public/assets/' + file.name;
    // file.path = __dirname + '/public/photobooth/' + file.name;
    fileName = file.name;
    console.log("uploading ", file.name, name);
  });

  // callback for when file is fully recieved
  form.on('end', function() {
    insertToDB(fileName);
    response.status(201);
    response.send("recieved file"); // respond to browser
  });

});

app.get('/fetchPictures', function(req,res){
  db.serialize(function() {
    db.all("SELECT * FROM Photobooth", getCallback);
  })
  function getCallback(err,rows){
    if (err){
      console.log(err);
    }else{
        res.send(rows);
    }

  }
});



function insertToDB(fileName) {
  var db = new sqlite3.Database(dbFile);
  //1 for favorite and 0 for not favorite.
  var sqlQuery = [fileName, " ", "0"];
  console.log(sqlQuery);
  db.serialize(function() {
    db.run("INSERT INTO Photobooth VALUES  (? ,?, ?) " ,sqlQuery, errorCallback);
  })
  db.close();

}

function errorCallback(err) {

  if (err) {
    console.log("error :", err, "\n");
  }
}



//app.get();

app.listen(portNum);
