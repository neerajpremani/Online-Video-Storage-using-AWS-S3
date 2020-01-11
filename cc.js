var AWS = require('aws-sdk'),
    fs = require('fs');
var express = require('express');
var app     = express();
var port    =   process.env.PORT || 8080;
var router = express.Router();
var url = require("url");

// For dev purposes only
AWS.config.update({ accessKeyId: '', secretAccessKey: '' });
var s3 = new AWS.S3();
// Read in the file, convert it to base64, store to S3



//Upload
router.get('/upload', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

 var param = url.parse(req.url,true).query;
  var link=param.link;
  var name=param.name;
console.log('link'+link);



fs.readFile(link, function (err, data) {
  if (err) { throw err; }

  var base64data = new Buffer(data, 'binary');

  
  s3.putObject({
    Bucket: 'testabhijeetcoder',
    Key: name,
    Body: base64data,
    ACL: 'public-read',
    ContentType: 'video/mp4'
  },function (resp) {
    console.log(arguments);
    console.log('Successfully uploaded package.');
    res.end(JSON.stringify({'status':'Successfully Uploaded'}));
  });

});
});
//Upload

//Listing
router.get('/list', function(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed


 var params = {
  Bucket: "testabhijeetcoder"
 //Key: "sample.3gp"
 };

s3.listObjects(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log("done");           // successful response

   
   var it=data.Contents.length;
   var links=[];
   var val;
   for(var i=0;i<it;i++){
   	console.log('Link is:https://s3.eu-central-1.amazonaws.com/testabhijeetcoder/'+data.Contents[i]['Key']);
   	 val="https://s3.eu-central-1.amazonaws.com/testabhijeetcoder/"+data.Contents[i]['Key'];
   	links.push({'id':i,'val':val});
   	console.log("length"+links.length);
   }
   res.end(JSON.stringify(links));
 });
});
//Listing


app.use('/', router);


// START THE SERVER
// ==============================================
app.listen(port);
console.log('Server Started on port: ' + port);
