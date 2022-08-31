const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//var data = {};


app.post("/", function(req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName,
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  //mailchimp Keys:
  //API Key
  // 1148a406ea84bd8b124114bc721b4ecf-us14   For Authentication

  // List ID
  // 48939473ce   Audience List Id

  const url = "https://us14.api.mailchimp.com/3.0/lists/48939473ce";
  const options = {
    method: "POST",
    auth: "rana:1148a406ea84bd8b124114bc721b4ecf-us14"
  };
  const httpsReq = https.request(url, options, function(response) {

    if (response.statusCode === 200){
      //res.send("Successfully Subscribed");
      res.sendFile(__dirname+"/success.html");
    }
    else{
      //res.send("Something went wrong");
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  httpsReq.write(jsonData);
  httpsReq.end();

});


app.post("/failure", function(req, res){
  //res.sendFile(__dirname + "/signup.html");
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${port}`)
});

/*
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
*/
