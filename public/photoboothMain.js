portNum = 8066;


var control = {
    clicked: 0
};

var imageCount = {
    count: 0
};

var labelCount = {
  num: 0
};

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

function showFullMenu(i) {
    //console.log("test if onclick works.");
    var y = document.getElementsByClassName('showForOption');
    console.log(control.clicked);

    if (control.clicked === 0) {
        y[i].style.display = 'block';
        control.clicked = 1;
    } else {
        y[i].style.display = 'none';
        control.clicked = 0;
    }

}

function addLabels(i){
  //we need to put the image to every lables from the database as well.
  //no need to do double containers!! orhterwise, we can delete labels from database.
  //not sure about this part!

  // var ImgURL = "http://138.68.25.50:10316/photobooth/removeTagButton.png";
   var ImgURL = "photobooth/removeTagButton.png";
  var x = document.getElementsByClassName('indilable');
  //this is for the p tag
  var y = document.getElementsByClassName('labelList');

  var addDiv = document.createElement("div");
  addDiv.className = "deleteLabel";
  y[i].appendChild(addDiv);

  //create a img tag
  var addImg = document.createElement("img");
  addImg.src = ImgURL;
  addImg.className = "removeButton";

  addDiv.appendChild(addImg);

  //this may not need
  var addSpan = document.createElement("span");
  addDiv.appendChild(addSpan);

  //in here, user add a labels, please update databasehere as well
  //may need to check if the x[i].value is empty!
  addSpan.innerHTML += " " + x[i].value;

  //delete labels
  //please update database here as well
  addImg.onclick = function(){
    if(addDiv.style.display === "none"){
      addDiv.style.display = "block";
    }else{
      addDiv.style.display="none";
    }

};
  //increment number of labels
  labelCount.num++;
}

//when changeTag call, show the whole div.labels container
//maybe in here, we get every labels from database a X sign
//and show the input tag and button.
function changeTag(){
  var showchangeTag

}

//update database of favorite
// function addToFavorites(imgName){
//   var url = "http://138.68.25.50:10316/query?img=" + imgNmae;
//   console.log("not implemented");
//   send a request
//   var oReq = new XMLHttpRequest();
// }
