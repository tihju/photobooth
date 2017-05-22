portNum = 8078;


var control = {
    clicked: 0,
    clicked1: 0
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

function showFullMenu() {
    //console.log("test if onclick works.");
    var y = document.getElementById('fullMenu');
    console.log(control.clicked1);

    if (control.clicked1 === 0) {
        y.style.display = 'block';
        control.clicked1 = 1;
    } else {
        y.style.display = 'none';
        control.clicked1 = 0;
    }

}

function addLabels(){
  //we need to put the image to every lables from the database as well.
  //no need to do double containers!! orhterwise, we can not delete labels from database.
  //not sure about this part!

  var x = document.getElementById('labelInput');
  //this is for the p tag
  var y = document.getElementById('p');

  var addDiv = makeDiv(y);

  var addImg = makeImg(addDiv);

  var addSpan = makeSpan(addDiv);

  //in here, user add a labels, please update databasehere as well
  //may need to check if the x[i].value is empty!
  addSpan.innerHTML += " " + x.value;

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

function makeDiv(y){
  //create div tag
  var addDiv = document.createElement("div");
  addDiv.className = "deleteLabel";
  y.appendChild(addDiv);
  return addDiv;
}

function makeImg(addDiv){
  // var ImgURL = "http://138.68.25.50:10316/photobooth/removeTagButton.png";
  var ImgURL = "photobooth/removeTagButton.png";
  var addImg = document.createElement("img");
  addImg.src = ImgURL;
  addImg.className = "removeButton";

  addDiv.appendChild(addImg);
  return addImg;
}

function makeSpan(addDiv){
  var addSpan = document.createElement("span");
  addDiv.appendChild(addSpan);
  return addSpan;
}

//when changeTag call, show the whole div.labels container
//maybe in here, we get every labels from database a X sign
//and show the input tag and button.
//i here is which picture's labels need to edit.
function changeTag(){
  var showAddInput = document.getElementById('showForChange');

  if (showAddInput.style.display == "block") {
    showAddInput.style.display = "";

  }
  else {
    showAddInput.style.display = "block";

    //get the labels of the pictures
    var pLabel = document.getElementById('p');
    pLabel.style.backgroundColor = "#CAB9B2";
    var s = pLabel.innerHTML;

    //list of labels
    var res = s.split(" ");

    //each label add a delete image;
    if(!res){
      for(i = 0; i < res.length; i++){
    
      var addDiv = makeDiv(pLabel);
      var addImg = makeImg(addDiv);
    
      var addSpan = makeSpan(addDiv);
      addSpan.innerHTML = res[i];
      }
    }
  }
}

//update database of favorite
// function addToFavorites(imgName){
//   var url = "http://138.68.25.50:10316/query?img=" + imgNmae;
//   console.log("not implemented");
//   send a request
//   var oReq = new XMLHttpRequest();
// }
