var control = { clicked : 0};

function uploadImage() {
  var url = "http://138.68.25.50:8078";
  var selectedFile = document.getElementById('fileSelector').files[0];
  var formData = new FormData();
  formData.append("userfile", selectedFile);

  var oReq = new XMLHttpRequest();
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
