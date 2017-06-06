// [START app]

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var DBHelper = require('./db');

var partnerCounts = {};

var failingPartners = [];

var db = new DBHelper();

app.use(bodyParser.json());

app.post("/v2/partner/:partnerId/callback/fail", function(req, res) {
  failingPartners.push(req.params.partnerId);
  res.end();
});

app.post("/v2/partner/:partnerId/callback/resetCounter", function(req, res) {
  for (var key in partnerCounts) {
  if (partnerCounts.hasOwnProperty(key)) {
    partnerCounts[key] = 0;
  }
}
  res.writeHead(200, {'Content-type': 'application/json'});
  res.end();
});

app.post("/v2/partner/:partnerId/callback", function(req, res) {

  if (failingPartners.indexOf(req.params.partnerId) != -1) {
    res.status(500).send('Something broke!');
    return;
  }

  // if (!partnerCounts[req.params.partnerId]) {
  //   partnerCounts[req.params.partnerId] = 0;
  // }
  db.updateProjectCount(req.params.partnerId);
  if (req.body.event && req.body.event.startsWith('connection')) {
    // console.log('request: ', req.url,
    //     ', counter: ', ++partnerCounts[req.params.partnerId],
    //     ', event: ', req.body.event,
    //     ', connectionid: ', req.body.connection.id,
    //     ', timestamp: ', req.body.timestamp);
    console.log(req.body.event + req.body.connection.id);
  } else {
    if (req.body.event && req.body.event.startsWith('stream')) {
      console.log('request: ', req.url,
          ', counter: ', ++partnerCounts[req.params.partnerId],
          ', event: ', req.body.event,
          ', streamid: ', req.body.stream.id,
          ', timestamp: ', req.body.timestamp);
    }
  }
  res.writeHead(200, {'Content-type': 'application/json'});
  res.end();

});

app.get("/", function(req, res) {
  result = db.getProjectCounts();
  res.writeHead(200, {'Content-type': 'application/json'});
  res.end(JSON.stringify(partnerCounts));
});


app.listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080))
});
