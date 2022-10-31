// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');

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

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
    return;
  }
  answers = content['results'][0]['incorrect_answers']
  correctAnswer = content['results'][0]['correct_answer']
  // console.log(correctAnswer)
  // adding the answer to the array at random position
  answers.splice(Math.floor(Math.random() * answers.length), 0, correctAnswer)

  const answerLinks = answers.map(answer => {
    return `<a style='color: red' href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>`
  })

  data = {
          'question' : content['results'][0]['question'],
          'answers' : answerLinks,
          'category' : content['results'][0]['category'],
          'difficulty' : content['results'][0]['difficulty']
        }
  res.render('trivia', data)
});

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