// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

//To allow sever to use public folder
app.use(express.static('public'));

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");

// set the view engine to ejs
app.set('view engine', 'ejs');

//Cookie Parser
app.use(cookieParser());

let nextVisitorId = 1;
app.get('/', (req, res) => {
  let lastVisit = req.cookies.visited;
  let visitorId = req.cookies.visitorId;

  if (lastVisit) {
    lastVisit = (parseInt((Date.now() - req.cookies.visited)/1000));
    msg = "It has been " + lastVisit+" seconds since your last visit!";
  }
  else
    msg = "You have never visited before.";

  console.log(visitorId)
  if (visitorId === undefined){
    visitorId =  ++nextVisitorId;
    res.cookie('visitorId', visitorId);
  }
  else
    visitorId =  req.cookies.visitorId;

  res.cookie('visitorId', visitorId);
  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
        name: req.query.name || "World",
        date: new Date().toLocaleString(),
        lastVisit : lastVisit ,
        visitorId : visitorId,
        msg: msg
  });
}); 