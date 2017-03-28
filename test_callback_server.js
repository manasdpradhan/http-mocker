// [START app]

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var partnerCounts = {};

var failingPartners = [];

app.use(bodyParser.json());

app.post("/v2/partner/:partnerId/callback/fail", function(req, res) {
  failingPartners.push(req.params.partnerId);
  res.end();
});

app.post("/v2/partner/:partnerId/callback/resetCounter", function(req, res) {
  i = 0;
  res.writeHead(200, {'Content-type': 'application/json'});
  res.end();
});

app.post("/v2/partner/:partnerId/callback", function(req, res) {

  if (failingPartners.indexOf(req.params.partnerId) != -1) {
    res.status(500).send('Something broke!');
    return;
  }

  if (!partnerCounts[req.params.partnerId]) {
    partnerCounts[req.params.partnerId] = 0;
  }
  if (req.body.event && req.body.event.startsWith('connection')) {
    console.log('request: ', req.url,
        ', counter: ', ++partnerCounts[req.params.partnerId],
        ', event: ', req.body.event,
        ', connectionid: ', req.body.connection.id,
        ', timestamp: ', req.body.timestamp);
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
  res.writeHead(200, {'Content-type': 'application/json'});
  res.end(JSON.stringify(partnerCounts));
});


app.listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080))
});
