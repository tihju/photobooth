portNum = 8078;

var control = {
  clicked: 0,
  isFavorite: 1,
  showFavorite: 0
};


var imageArray = new Array();

//when click the upload button
function uploadImage() {
  var selectedFile = document.getElementById('fileSelector').files[0];


  var imageId = imageArray.length;
  imageArray.push({
    id: imageId,
    showFullMenuClicked: 0,
    labels: "",
    imageName: selectedFile.name,
    favorite: 0
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
    if(oReq.status == 500) {
      let pictureBlock = document.getElementsByClassName("indiPicture");
      pictureBlock[0].remove();
      alert("Upload Error");
    }
    else {
      unFade(imageId);
    }
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
    setPictureBlock(fr.result, imageId, selectedFile);
  };
  fr.readAsDataURL(selectedFile);


}

// get html file from server and set it
function setPictureBlock(imageFile, imageId, selectedFile) {
  var oReq = new XMLHttpRequest();
  var url = "indipicture.html";
  oReq.open("GET", url);
  oReq.onload = function() {

    var pictures = document.getElementsByClassName("pictures")[0];
    var indipicture = document.createElement('div');
    indipicture.setAttribute('class', 'indiPicture');
    if (pictures.firstChild){
      pictures.insertBefore(indipicture,pictures.firstChild);
    }else{
      pictures.appendChild(indipicture);
    }

    indipicture.innerHTML = oReq.responseText;


    changeTemplate(imageFile, imageId);

    //where upload new image by the user
    if (selectedFile !== undefined) {
      uploadImageToServer(selectedFile, imageId);
      //request google api labels here? not sure.
      getLabelsFromApi(selectedFile);
    }
    //where pulling image's labels from the server database.
    else {
      unFade(imageId);
      var labels = imageArray[imageId].labels;
      var labelArr = labels.split(";");

      for (var i = 0; i < labelArr.length; i++) {
        if (labelArr[i] != "" && labelArr[i] != " ") {
          addLabels(imageId.toString(), labelArr[i]);
        }
      }
    }

  }
  oReq.send();

}

//this is to give every image a new id for needed
//onclick function.
function changeTemplate(imageFile, imageId) {

  // change the image
  var img = document.getElementById('imageFile');
  img.setAttribute('id', 'imageFile' + imageId);
  img.setAttribute('src', imageFile);
  img.setAttribute('alt', "no image");
  img.style.opacity = 0.5;


  var ids = ['fullMenu', 'changeTagBtn', 'changeFavBtn', 'showFullMenuBtn',
    'labels', 'showForChange', 'labelInput', 'addBtn'
  ];

  for (var i = 0; i < ids.length; i++) {
    var element = document.getElementById(ids[i]);
    element.setAttribute('id', ids[i] + imageId);

    if (ids[i] == 'changeTagBtn') {
      element.onclick = function() {return changeTag(imageId);}
    }
  }

}


function createPictureBlock(fileName, id, labels, favorite) {
  //get the image path of server
  var src = "/assets/" + fileName;
  setPictureBlock(src, id);
}

var uploadClick = 0;

function showUpload() {
  var x = document.getElementById('showForUpload');

  if (uploadClick === 0) {
    x.style.display = 'block';
    uploadClick = 1;
  } else {
    x.style.display = 'none';
    uploadClick = 0;
  }
}

function showUpload2() {
  var x = document.getElementById('MobileUpload');

  if (uploadClick === 0) {
    x.style.display = 'block';
    uploadClick = 1;
  } else {
    x.style.display = 'none';
    uploadClick = 0;
  }
}

function showFullMenu(id) {
  //console.log("test if onclick works.");

  var num = id.replace("showFullMenuBtn","");
  var fullMenuId = id.replace("showFullMenuBtn", "fullMenu");

  var showFullMenuBtn = document.getElementById(fullMenuId);

  if (imageArray[num].showFullMenuClicked === 0) {
    showFullMenuBtn.style.display = 'block';
    imageArray[num].showFullMenuClicked = 1;
  } else {
    showFullMenuBtn.style.display = 'none';
    imageArray[num].showFullMenuClicked = 0;
  }

}

//make every label has a delete image
function addLabels(id, text) {
  var num = id.replace("addBtn", "");

  var labelInput = document.getElementById('labelInput' + num);
  //this is for the p tag
  var labels = document.getElementById('labels' + num);
  var addDiv = makeDiv(labels);
  var addImg = makeImg(addDiv);
  var addSpan = makeSpan(addDiv);
  var labelToEdit = "";

  //in here, user add a labels, please update databasehere as well
  //may need to check if the x[i].value is empty!

  if (text === undefined) {
    addDiv.getElementsByClassName('removeButton')[0].style.display = 'inline';
    text = labelInput.value;
    updateLabelsToDB(num, text);
  }

  addSpan.innerHTML += " " + text;

  changeTag(num);
  changeTag(num);
  //delete labels
  //please update database here as well
  addImg.onclick = function() {
    addDiv.remove();
    changeTag(num);
    changeTag(num);
    removeLabelsFromDB(num, text);
  };

}

function updateLabelsToDB(num, label) {
  var imageName = imageArray[num].imageName;
  var query = "/query?op=add&img=" + imageName + "&label=" + label;

  var oReq = new XMLHttpRequest();
  oReq.open("GET", query);

  oReq.onload = function() {
    if (oReq.status == 500) {
      let imageBlock = document.getElementById('labels'+num);
      let tagBlocks = imageBlock.getElementsByClassName('deleteLabel');
      let index = tagBlocks.length - 1;
      tagBlocks[index].remove();
      alert("Label Existed");
    }
    console.log(oReq.status);
  }

  oReq.send();
}

function removeLabelsFromDB(num, label) {
  console.log(label);
  var imageName = imageArray[num].imageName;
  var query = "/query?op=remove&img=" + imageName + "&label=" + label;

  var oReq = new XMLHttpRequest();
  oReq.open("GET", query);

  oReq.onload = function() {
    console.log(oReq.responseText);
  }

  oReq.send();
}

function makeDiv(y) {
  //create div tag
  var addDiv = document.createElement("div");
  addDiv.className = "deleteLabel";
  y.appendChild(addDiv);
  return addDiv;
}

function makeImg(addDiv) {
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

function changeTag(id) {
  //get the p tag
  var labelBlock = document.getElementById('labels' + id);
  //the div that contains input and button.
  var showingBlock = document.getElementById('showForChange' + id);

  //images with lables
  var removeButtons = labelBlock.getElementsByClassName('removeButton');

  if (!removeButtons[0] || removeButtons[0].style.display != 'inline') {
    labelBlock.style.backgroundColor = '#CAB9B2';


    if (removeButtons.length < 10) {
      labelBlock.style.borderBottom = '0px solid black';
      showingBlock.style.display = 'block';
    }


    for (var i = 0; i < removeButtons.length; i++) {
      removeButtons[i].style.display = 'inline';
    }
  }
  else {
    labelBlock.style.backgroundColor = 'white';
    labelBlock.style.borderBottom = '1px solid black';
    showingBlock.style.display = 'none';

    var removeButtons = labelBlock.getElementsByClassName('removeButton');

    for (var i = 0; i < removeButtons.length; i++) {
      removeButtons[i].style.display = 'none';
    }
  }
}

var filterClick = 0;

//for the nav filter
function showFilter(){
  var filterMenu = document.getElementById('showForFilter');
  var filterWord = document.getElementById('FilterWord');
  var filter = document.getElementById('filter');

  if (filterMenu.style.display == 'block') {
    filterMenu.style.display = 'none';
    filterWord.style.display = 'none';
    filter.style.display = 'block';
  }
  else {
    filterMenu.style.display = 'block';
    filterWord.style.display = 'block';
    filter.style.display = 'none';
    filterClick = 1;
  } 
}

function showFilter2(){
  var filterMenu = document.getElementById('showForFilter');
  var filterWord = document.getElementById('FilterWord');
  var filter = document.getElementById('filter');
}

function showFilter3(){
  var mobilefilter = document.getElementById('MobileFilter');

  if (mobilefilter.style.display == 'block') {
    mobilefilter.style.display = 'none';
  } else {
    mobilefilter.style.display = 'block';
  }
}

//fetch pictures from server when open main page.
//called when load the main webpage
function fetchPictures() {
  var url = "/fetchPictures";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url);

  oReq.onload = function() {

    console.log(oReq.responseText);

    var jsonArr = JSON.parse(oReq.responseText);

    //putting every picture's info into imageArray.
    for (var i = 0; i < jsonArr.length; i++) {
      imageArray.push({
        id: i,
        showFullMenuClicked: 0,
        labels: jsonArr[i].labels,
        imageName: jsonArr[i].fileName,
        favorite: jsonArr[i].favorite
      });

      //putting image into the html page.
      createPictureBlock(jsonArr[i].fileName, i, jsonArr[i].labels, jsonArr[i].favorite);

    }


  }
  oReq.send();
}

//show the upload file name
function chooseFile(e) {
  document.getElementById('fileName').innerHTML = e.files[0].name;
  document.getElementById('fileName2').innerHTML = e.files[0].name;
}


//update database of favorite
function addToFavorites(id){
  var num = id.replace("changeFavBtn", "");
  //know which image to update
  var imageName = imageArray[num].imageName;
  var passVal = 0;

  //find the button, so that we can change the value of it
  var changeValue = document.getElementById(id);
  //changing the button text.
  console.log(changeValue);
  console.log(changeValue.value);
  if(control.isFavorite === 1){
    changeValue.value = "unfavorite";
    control.isFavorite = 0;
  }else{
    changeValue.value = "addToFavorites";
    control.isFavorite = 1;
  }

  if(imageArray[num].favorite === 0){
      passVal = 1;
      imageArray[num].favorite = 1;
  } else {
      imageArray[num].favorite = 0;
  }

  var query = "/query?op=fav&img=" + imageName + "&favorite=" + passVal;

  var oReq = new XMLHttpRequest();
  oReq.open("GET", query);

  oReq.onload = function() {
    console.log(oReq.responseText);

  }
  oReq.send();
}

//only show picture with favorite is 1;
//when click again go back to show all images.
function favoriteFilter(){
  console.log("in favoriteFilter");
  var buttonVal = document.getElementsByClassName('firstLevel');
  var allImgs = document.getElementsByClassName('indiPicture');
  console.log(allImgs);
  var imageNum = imageArray.length;
  if(control.showFavorite === 0){
    for(i = 0; i < imageNum; i++){
      if(imageArray[i].favorite === 0){
        //block this images
        allImgs[imageNum -1 - imageArray[i].id].style.display = "none";
      }
    }
    control.showFavorite = 1;
    buttonVal[1].textContent = "All";
  }else{//not sure if this is neeeded
    for(i = 0; i < imageNum; i++){
      if(imageArray[i].favorite === 0){
        //block this images
        allImgs[imageNum -1 - imageArray[i].id].style.display = "block";
      }
    }
    control.showFavorite = 0;
    buttonVal[1].textContent = "favorite";
  }

}


function getLabelsFromApi(imageName){
  // var query = "/query?op=fav&img=" + imageName + "&favorite=" + passVal;
  var quary = "/query?op=apiLabel&img=" + imageName;
}

function clearFilter() {
  document.getElementById('Secondfilter').value='';
}

function clearFilter2() {
  document.getElementById('Thirdfilter').value='';
}