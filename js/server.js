var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
const tjs = require('translation.js');
var request = require('request');

var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;
var APP_ID = "10943268";
var API_KEY = "V4tY1N9RiVd0paVRgf4lEz43";
var SECRET_KEY = "5xtWV6IoHvn05GIHgCtNpLEd5ZOi2fCu";
var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);


var HttpClient = require("baidu-aip-sdk").HttpClient;
HttpClient.setRequestOptions({timeout: 5000});
HttpClient.setRequestInterceptor(function(requestOptions) {
    requestOptions.timeout = 5000;
    return requestOptions;
});

var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);
server.listen(8081,function(){
   console.log('Server Activation');
   
   var returnValue = " ";
   
   var firebase = require("firebase");
   var config = {
                    apiKey: "AIzaSyBjPs19_HsIW8EQ-d8Iqa_MFT-qfheIS5g",
                    authDomain: "wild-doctor.firebaseapp.com",
                    databaseURL: "https://wild-doctor.firebaseio.com",
                    projectId: "wild-doctor",
                    storageBucket: "wild-doctor.appspot.com",
                    messagingSenderId: "23522572045"
                };
    firebase.initializeApp(config);
    var db = firebase.database();
    /*
    var ref = db.ref("/Plant data/Redbud");
    var value = {
        Name: "Redbud",
        Description: "Redbud is a beatiful flower."
    }
    ref.set(value);
   */
   server.post(/^\/wd/,function(req,res,next){
       
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
       
       console.log('Got Post request');
       var img = req.body.img;
       var image = img.substring(22);
       
       client.plantDetect(image).then(function(result) {
            console.log(JSON.stringify(result));
            tjs.translate({
                text: result.result[0].name,
                from: 'zh-CN',
                to: 'en'
            }).then(tjsresult => {
                console.log(tjsresult.result.toString());
                var englishResult = tjsresult.result.toString();

                var db = firebase.database();
                var ref = db.ref("/Plant data/" + englishResult);
                ref.once("value", function(snapshot) {
                    if (snapshot.val() != null) {
                        console.log(snapshot.val());
                        var string = JSON.stringify(snapshot.val());
                        var objectValue = JSON.parse(string);
                        console.log(objectValue['Description']);
                        var jsonInfo = {
                            "En_Result" : englishResult,
                            "Description" : objectValue['Description']
                        };
                        console.log(jsonInfo);
                        var jsonInfoStr = JSON.stringify(jsonInfo);
                        res.send(jsonInfoStr);
                        res.end();
                    } else {
                        console.log("Sorry, Firebase not this data.");
                        console.log("Find data in Wikipedia.");
                        request('https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&page='+englishResult+'&format=json', function (error, response, body) {
                            var json = JSON.parse(body);
                            if (!("error" in json)){
                                var jsonInfo = {
                                    "En_Result" : englishResult,
                                    "Description" : json['parse']['text']['*']
                                };
                                console.log(jsonInfo);
                                var jsonInfoStr = JSON.stringify(jsonInfo);
                                res.send(jsonInfoStr);
                                res.end();
                                var ref = db.ref("/Plant data/"+englishResult);
                                var value = {
                                    Name: englishResult,
                                    Description: json['parse']['text']['*']
                                }
                                ref.set(value);
                            } else {
                                console.log("Sorry, both data source are not this data.");
                                console.log("Change other name and find again.");
                                tjs.translate({
                                    text: result.result[1].name,
                                    from: 'zh-CN',
                                    to: 'en'
                                }).then(tjsresult => {
                                    console.log(tjsresult.result.toString());
                                    var englishResult = tjsresult.result.toString();

                                    var db = firebase.database();
                                    var ref = db.ref("/Plant data/" + englishResult);
                                    ref.once("value", function(snapshot) {
                                        if (snapshot.val() != null) {
                        console.log(snapshot.val());
                        var string = JSON.stringify(snapshot.val());
                        var objectValue = JSON.parse(string);
                        console.log(objectValue['Description']);
                        var jsonInfo = {
                            "En_Result" : englishResult,
                            "Description" : objectValue['Description']
                        };
                        console.log(jsonInfo);
                        var jsonInfoStr = JSON.stringify(jsonInfo);
                        res.send(jsonInfoStr);
                        res.end();
                    } else {
                        console.log("Sorry, Firebase not this data.");
                        console.log("Find data in Wikipedia.");
                        request('https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&page='+englishResult+'&format=json', function (error, response, body) {
                            var json = JSON.parse(body);
                            if (!("error" in json)){
                                var jsonInfo = {
                                    "En_Result" : englishResult,
                                    "Description" : json['parse']['text']['*']
                                };
                                console.log(jsonInfo);
                                var jsonInfoStr = JSON.stringify(jsonInfo);
                                res.send(jsonInfoStr);
                                res.end();
                            } else {
                                console.log("Sorry, both data source are not this data.");
                                var jsonInfo = {
                                    "En_Result" : englishResult,
                                    "Description" : "Sorry, Wild Doctor and Wikipedia are not find the data."
                                };
                                console.log(jsonInfo);
                                var jsonInfoStr = JSON.stringify(jsonInfo);
                                res.send(jsonInfoStr);
                                res.end();
                                res.send(jsonInfoStr);
                                res.end();
                                var ref = db.ref("/Plant data/"+englishResult);
                                var value = {
                                    Name: englishResult,
                                    Description: json['parse']['text']['*']
                                }
                                ref.set(value);
                            }
                        });
                    }
                                    });
                                });
                            }
                            
                        });
                    }
                    
                });
                
            
            });
        }).catch(function(err) {
            console.log(err);
            res.send(err);
            res.end();
        });
        
   });
});

