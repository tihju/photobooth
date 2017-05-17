

function uploadImage() {
  var url = "http://138.68.25.50:8066";
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
