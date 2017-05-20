var control = { clicked : 0};

//this is to hold datas
// var datas = {};

//this is for the number of rows/pictures in database
// var numOfPic = 0;


//getting the whole contents of the database;
// function getDataBase(){
//   var url = "http://138.68.25.50:10316/query?op=";
//   var oReq = new XMLHttpRequest();
//   //create the function to be excuted when the server respond is ready
//   oReq.onreadystate = function(){
//     if(this.readyStryte == 4 && this.status == 200){
//       data = this.responseText;
//     }
//   };
//   oReq.open("GET", "select * from Photobooth", true);
//   oReq.send();
// }

//get the count  of pictures
// function countRows(callback){
//   data.transaction(function(tx){
//     tx.executeSql('SELECT id FROM table', [], function(tx,results){
//       var len = results.rows.length;
//       callback(len);
//     });
//   });
// }

function uploadImage() {


  // var url = "http://138.68.25.50:8066";
  var url = "http://138.68.25.50:10316";

  // var url = "http://138.68.25.50:8078";


  //where we find the file handle

  var selectedFile = document.getElementById('fileSelector').files[0];
  var formData = new FormData();
  formData.append("userfile", selectedFile);

  var oReq = new XMLHttpRequest();
  //POST requests contain data in the body
  //the "true" is the default for the third param, so
  //it is often omitted; it means do the upload asynochornously, that is
  //using a callback instead of blocking until the operation is conpleted.
  oReq.open("POST", url);
  oReq.onload = function() {
    console.log(oReq.responseText);
  }
  oReq.send(formData);

}

function showUpload(){
  var x = document.getElementById('showForUpload');
  console.log(control.clicked);

  if(control.clicked === 0){
    x.style.display = 'block';
    control.clicked = 1;
  }else{
    x.style.display = 'none';
    control.clicked = 0;
  }
}

function showFullMenu(){
  //console.log("test if onclick works.");
  var y = document.getElementById('showForOption');
  var optionBut = document.getElementById('optionButton1');

  console.log(control.clicked);

  if(control.clicked === 0){
    y.style.display = 'block';
    optionBut.style.display = 'none';
    control.clicked = 1;
  }else{
    y.style.display = 'none';
    control.clicked = 0;
    optionBut.style.display = 'block';
  }

}

// i images
function addLabels(i){

  let ImgURL = "http://138.68.25.50:8078/photobooth/removeTagButton.png";

  var x = document.getElementsByClassName('indilable');
  var y = document.getElementsByClassName('labelList');

  y[i].innerHTML += "<img src='"  + ImgURL + "' class='removeButton' onclick='remove(" + i + ")'>" + x[i].value;
}

function remove(i){

}


// function addToFavorites(imgName){
//   var url = "http://138.68.25.50:10316/query?img=" + imgNmae;
//   console.log("not implemented");
//   send a request
//   var oReq = new XMLHttpRequest();
// }
