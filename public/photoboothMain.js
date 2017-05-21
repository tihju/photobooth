portNum = 8066;


var control = {
    clicked: 0
};

var imageCount = {
    count: 0
};

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
    var selectedFile = document.getElementById('fileSelector').files[0];
    var imageId = imageCount.count++;

    readFileAndFading(selectedFile,imageId);


}

function uploadImageToServer(selectedFile,imageId){
    var url = "http://138.68.25.50:" + portNum;

    var formData = new FormData();

    // upload file to server
    formData.append("userfile", selectedFile);
    var oReq = new XMLHttpRequest();

    oReq.open("POST", url);
    oReq.onload = function () {
        console.log(oReq.responseText);
        unFade(imageId);

    }
    oReq.send(formData);
}

function unFade(imageID){
    var img = document.getElementById('imageFile' + imageID);
    img.style.opacity = 1;

}

// read from local
function readFileAndFading(selectedFile,imageId) {

    var fr = new FileReader();

    fr.onload = function () {
        setPictureBlock(fr.result,imageId);
    };
    fr.readAsDataURL(selectedFile);

}

// get html file from server and set it
function setPictureBlock(selectedFile,imageId) {
    var oReq = new XMLHttpRequest();
    var url = "indipicture.html";
    oReq.open("GET", url);
    oReq.onload = function () {

        var pictures = document.getElementsByClassName("pictures")[0];


        var indipicture = document.createElement('div');
        indipicture.setAttribute('class', 'indipicture');

        indipicture.innerHTML = oReq.responseText;
        pictures.appendChild(indipicture);

        var img = document.getElementById('imageFile');
        img.setAttribute('id', 'imageFile' + imageId);
        img.setAttribute('src', selectedFile);
        img.setAttribute('alt', "no image");
        img.style.opacity = 0.5;

        uploadImageToServer(selectedFile,imageId);

    }
    oReq.send();

}




function showUpload() {
    var x = document.getElementById('showForUpload');
    console.log(control.clicked);

    if (control.clicked === 0) {
        x.style.display = 'block';
        control.clicked = 1;
    } else {
        x.style.display = 'none';
        control.clicked = 0;
    }
}

function showFullMenu() {
    //console.log("test if onclick works.");
    var y = document.getElementById('showForOption');
    console.log(control.clicked);

    if (control.clicked === 0) {
        y.style.display = 'block';
        control.clicked = 1;
    } else {
        y.style.display = 'none';
        control.clicked = 0;
    }

}


// function addToFavorites(imgName){
//   var url = "http://138.68.25.50:10316/query?img=" + imgNmae;
//   console.log("not implemented");
//   send a request
//   var oReq = new XMLHttpRequest();
// }
