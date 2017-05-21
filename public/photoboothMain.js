portNum = 8066;


var control = {
  clicked: 0
};


var imageArray = new Array();

var imageObject = {
  id: -1,
}

var labelCount = {
  num: 0
};

function uploadImage() {
  var selectedFile = document.getElementById('fileSelector').files[0];


  var imageId = imageArray.length;
  imageArray.push({
    id: imageId,
    showFullMenuClicked: 0,
    labelCount: 0
  });



  readFileAndFading(selectedFile, imageId);


}

function uploadImageToServer(selectedFile, imageId) {
  var url = "http://138.68.25.50:" + portNum;

  var formData = new FormData();

  // upload file to server
  formData.append("userfile", selectedFile);

  var oReq = new XMLHttpRequest();

  oReq.open("POST", url);
  oReq.onload = function() {
    console.log(oReq.responseText);
    unFade(imageId);

  }
  oReq.send(formData);
}

function unFade(imageID) {
  var img = document.getElementById('imageFile' + imageID);
  img.style.opacity = 1;

}

// read from local
function readFileAndFading(selectedFile, imageId) {

  var fr = new FileReader();

  fr.onload = function() {
    setPictureBlock(fr.result, selectedFile, imageId);
  };
  fr.readAsDataURL(selectedFile);


}

// get html file from server and set it
function setPictureBlock(imageFile, selectedFile, imageId) {
  var oReq = new XMLHttpRequest();
  var url = "indipicture.html";
  oReq.open("GET", url);
  oReq.onload = function() {

    var pictures = document.getElementsByClassName("pictures")[0];
    var indipicture = document.createElement('div');
    indipicture.setAttribute('class', 'indipicture');

    indipicture.innerHTML = oReq.responseText;
    pictures.appendChild(indipicture);

    changeTemplate(imageFile, imageId);

    uploadImageToServer(selectedFile, imageId);

  }
  oReq.send();

}

function changeTemplate(imageFile, imageId) {
  // change the template

  // change the image
  var img = document.getElementById('imageFile');
  img.setAttribute('id', 'imageFile' + imageId);
  img.setAttribute('src', imageFile);
  img.setAttribute('alt', "no image");
  img.style.opacity = 0.5;


  var ids = ['fullMenu', 'changeTagBtn', 'changeFavBtn', 'showFullMenuBtn',
    'labels', 'showForChange', 'labelInput', 'addBtn'
  ];

  for (i = 0; i < ids.length; i++) {
    var element = document.getElementById(ids[i]);
    element.setAttribute('id', ids[i] + imageId);

  }

}




function showUpload() {
  var x = document.getElementById('showForUpload');

  if (control.clicked === 0) {
    x.style.display = 'block';
    control.clicked = 1;
  } else {
    x.style.display = 'none';
    control.clicked = 0;
  }
}

function showFullMenu(id) {
  //console.log("test if onclick works.");

  num = id.slice(-1);

  var showFullMenuBtn = document.getElementById('fullMenu' + num);


  var clicked = imageArray[num].showFullMenuClicked;
  if (clicked === 0) {
    showFullMenuBtn.style.display = 'block';
    clicked = 1;
  } else {
    showFullMenuBtn.style.display = 'none';
    clicked = 0;
  }

}

function addLabels(id) {
  //we need to put the image to every lables from the database as well.
  //no need to do double containers!! orhterwise, we can delete labels from database.
  //not sure about this part!

  // var ImgURL = "http://138.68.25.50:10316/photobooth/removeTagButton.png";

  num = id.slice(-1);

  var labelInput = document.getElementById('labelInput'+num);
  //this is for the p tag
  var labels = document.getElementById('labels'+num);

  var addDiv = makeDiv(labels);

  var addImg = makeImg(addDiv);

  var addSpan = makeSpan(addDiv);

  //in here, user add a labels, please update databasehere as well
  //may need to check if the x[i].value is empty!
  addSpan.innerHTML += " " + labelInput.value;

  //delete labels
  //please update database here as well
  addImg.onclick = function() {
    if (addDiv.style.display === "none") {
      addDiv.style.display = "block";
    } else {
      addDiv.style.display = "none";
    }

  };
  //increment number of labels
  imageArray[num].labelCount++;
}


function makeDiv(y) {
  //create div tag
  var addDiv = document.createElement("div");
  addDiv.className = "deleteLabel";
  y.appendChild(addDiv);
  return addDiv;
}

function makeImg(addDiv) {
  // var ImgURL = "http://138.68.25.50:10316/photobooth/removeTagButton.png";
  var ImgURL = "photobooth/removeTagButton.png";
  var addImg = document.createElement("img");
  addImg.src = ImgURL;
  addImg.className = "removeButton";

  addDiv.appendChild(addImg);
  return addImg;
}

function makeSpan(addDiv) {
  var addSpan = document.createElement("span");
  addDiv.appendChild(addSpan);
  return addSpan;
}

//when changeTag call, show the whole div.labels container
//maybe in here, we get every labels from database a X sign
//and show the input tag and button.
function changeTag() {
  var showchangeTag

}


function fetchPictures() {
  var url = "/fetchPictures";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url);

  oReq.onload = function() {
    console.log(oReq.responseText);

  }
  oReq.send();
}

//update database of favorite
// function addToFavorites(imgName){
//   var url = "http://138.68.25.50:10316/query?img=" + imgNmae;
//   console.log("not implemented");
//   send a request
//   var oReq = new XMLHttpRequest();
// }
