var config = {
                    apiKey: "AIzaSyBjPs19_HsIW8EQ-d8Iqa_MFT-qfheIS5g",
                    authDomain: "wild-doctor.firebaseapp.com",
                    databaseURL: "https://wild-doctor.firebaseio.com",
                    projectId: "wild-doctor",
                    storageBucket: "wild-doctor.appspot.com",
                    messagingSenderId: "23522572045"
                };
firebase.initializeApp(config);
var database = firebase.database();

document.getElementById('Submit').onclick=function() {
    var Name = document.getElementById("Name").value;
    var Description = document.getElementById("Description").value;
    firebase.database().ref('/Plant data/' + Name).set({
            Name: Name,
            Description : Description
            });
            alert("Thank You.");
            document.getElementById("Name").value = "";
            document.getElementById("Description").value = "";
}
