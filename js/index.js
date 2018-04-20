//Take photo
var aVideo=document.getElementById('video');
var aCanvas=document.getElementById('canvas');
var ctx=aCanvas.getContext('2d');
                
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
navigator.getUserMedia({video:true}, gotStream, noStream);
                
function gotStream(stream) {
    video.src = URL.createObjectURL(stream);
    video.onerror = function () {
        stream.stop();
    };
    stream.onended = noStream;
    video.onloadedmetadata = function () {
        //alert('Camera Activation');
    };
}
                
function noStream(err) {
    alert(err);
}

document.getElementById("snap").addEventListener("click", function() {
    ctx.drawImage(aVideo, 0, 0, 640, 480);
    var dataURL = aCanvas.toDataURL("image/jpeg", 1);
    console.log(dataURL);
    var xhr = new XMLHttpRequest();
    getData(dataURL);
});

//Upload Photo
$("#uploadImage").change(function(){
      readImage( this );
    });
 
function readImage(input) {
      if ( input.files && input.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
          console.log(e.target.result);
          $('#img').attr( "src", e.target.result );
          $('#img').attr( "width", 640 );
          $('#img').attr( "height", 480 );
          getData(e.target.result);
        };       
        FR.readAsDataURL( input.files[0] );
      }
}

//Call Rest API
function getData(img) {
    document.getElementById("ResultName").innerHTML="";
    document.getElementById("ResultDescription").innerHTML="";
    document.getElementById("loadingMDI").style.display = "block";
    var http = new XMLHttpRequest();
        $.ajax({
            url: "https://wilddoctor.herokuapp.com/wd/",
            data: {img : img},
            type: "POST",
            dataType: "json",
            success: function(data){
                document.getElementById("loadingMDI").style.display = "none";
                var json = $.parseJSON(data);
                console.log(json);
                console.log(json['En_Result']);
                console.log(json['Description']);
                document.getElementById("ResultName").innerHTML=json['En_Result'];
                document.getElementById("ResultDescription").innerHTML=json['Description'];

            },
            error: function(){
                console.log("error");
                document.getElementById("loadingMDI").style.display = "none";
                document.getElementById("ResultName").innerHTML="Ohhh, there have a error.";
                document.getElementById("ResultDescription").innerHTML="Restart the website and try again :)";
            }
        });
}