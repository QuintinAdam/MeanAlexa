var getInsult = function(insult) {
  var http = require("http");
  var url = "http://pleaseinsult.me/api?severity=random";
  var request = http.get(url, function (response) {
      var buffer = "",
          data;

      response.on("data", function (chunk) {
          buffer += chunk;
      });

      response.on("end", function (err) {

          data = JSON.parse(buffer);
          insult(data);
      });

  });
};

/**
 * App ID for the skill
 */
var APP_ID = "changeme"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";


var MeanAlexa = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MeanAlexa.prototype = Object.create(AlexaSkill.prototype);
MeanAlexa.prototype.constructor = MeanAlexa;

MeanAlexa.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("MeanAlexa onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

MeanAlexa.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MeanAlexa onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the MeanAlexa extension, You can ask for a insult!";
    response.ask(speechOutput);
};

MeanAlexa.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MeanAlexa onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

MeanAlexa.prototype.intentHandlers = {
    // register custom intent handlers
    MeanAlexaIntent: function (intent, session, response) {
        var personName = intent.slots.PersonName.value.toLowerCase();
        var cardTitle = "Insult for " + personName;
        var http = require("https");
        var insult = '';
        getInsult(function(insult) {
          // use the return value here instead of like a regular (non-evented) return value
          console.log(insult.insult);
          insult = insult.insult;
          if (insult) {
            var insultWithName = personName + ", " + insult;
            response.tellWithCard(insultWithName, cardTitle, insultWithName);
          } else {
            response.ask("I'm sorry, " + personName +  " is not worth insulting. What else can I help?");
          }
        });
        // var insult = "A fish has more brains than you.";
        // var insult = getInsult;
    },
    NiceAlexaIntent: function (intent, session, response) {
        var personName = intent.slots.PersonName.value.toLowerCase();
        var cardTitle = "Motivation for " + personName;
        var motivate = "Keep your eyes up and your head on straight!";
        // var motivate = getMotivation;

        if (motivate) {
          var motivateWithName = personName + ", " + motivate;
          response.tellWithCard(motivateWithName, cardTitle, motivateWithName);
        } else {
          response.ask("I'm sorry, " + personName +  " is not worth motivating. What else can I help?");
        }
    },
    HelpIntent: function (intent, session, response) {
        response.ask("You can say insult name or motivate name. What would you like to do?");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MeanAlexa skill.
    var meanAlexa = new MeanAlexa();
    meanAlexa.execute(event, context);
};

