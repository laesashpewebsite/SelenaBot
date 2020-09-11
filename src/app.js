import axios from 'axios';
// import backend from './getBackend'
const { WebClient } = require("@slack/web-api");

const { createEventAdapter } = require("@slack/events-api");

const dotenv = require("dotenv");
dotenv.config();


const web = new WebClient(process.env.SLACK_OAUTH_TOKEN);
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

const port = process.env.PORT || 3000;
const SelenaBotId = "U01A6KT325R";

var unirest = require("unirest");


var req = unirest("GET", "https://healthruwords.p.rapidapi.com/v1/quotes/");

let scholarships = {};

req.query({
  maxR: "1",
});

req.headers({
  "x-rapidapi-host": "healthruwords.p.rapidapi.com",
  "x-rapidapi-key": "3bc797064dmsh88cd64ba177bd18p15ebc0jsn41321cd9714e",
  useQueryString: true,
});

slackEvents.on("app_mention", (event) => {
  var tempString = event.text;
  var userId = event.user;
  var channelId = event.channel;
  tempString = tempString.toUpperCase();
  if ( userId !== SelenaBotId) {
    // this is to prevent from sending messages when te bot detects itself and
    //when @Selena  bot is not detected
    if (tempString.includes(`/HELP`)) 
    {
      //ENABLE THIS COMMENT TO POST TO SLACK
      sendMessage( channelId, `Can't help you yet but I can tell you, you are awesome`);
    } 
    else if (tempString.includes(`/EVENT`))
    {
        eventText(channelId, userId)
    } 
    else if (tempString.includes(`/SCHOLARSHIP`)) 
    {
      scholarshipText(channelId, userId);
    } 
    else if (tempString.includes(`/MOTIVATE`)) 
    {
      getMotivation(channelId);
    } 
    else if(tempString.includes(`/SHOWPOINT`)){
        defaulText(channelId);
    }
    else if(tempString.includes(`/POSTPOINT`)){
        defaulText(channelId);
    }
    else {
      sendMessage(channelId,`Did you want something? <@${userId}>?`);
      helpText(channelId,userId);
    }
  }
});

var defaulText=(channelId)=>{
    sendMessage(channelId,'feature not implemented yet')
}

var eventText = (channelId, userId) => {
  //This function will do is it will output all the upcoming events
  //within a 2 week time span. Display their information accordingly like so:
  // "Events_name is on Events_date: Events_description this event is worth this
  // events is under Event_category so you will get Events_point if you attend"
  sendMessage(channelId, `Hola <@${userId}>, I can't help you right now with that, but you can ask your amazing Eboard in the meantime!`);

};
var helpText = (channelId, userId) => {
  //This function will output a list of potential commands so people can see how
  //SELENA Bot
  var helpString = `these are my current list of commands: \n
     /scholarships\n 
     /motivate \n 
     /events\n `;
    sendMessage(channelId,helpString);
    sendMessage(channelId,`also, you are awesome @${userID}`);

};
var scholarshipText = (channelId, userId) => {
    var tempString ='\n';
    axios
    .get("https://laesa-backend.herokuapp.com/api/scholarships")
    .then((res) => {
        scholarships = res.data;
        // console.log(scholarships);
        
        for (var i=0; i< scholarships.length; i++){
            tempString += `${scholarships[i].title}: ${scholarships[i].description}. Due on ${scholarships[i].deadline}`;
            tempString +='\n\n';
        }
        // console.log(`Backend connected! @${userId} upcoming scholar are: ${tempString}`)
        sendMessage(channelId,` <@${userId}> upcoming scholarships are: ${tempString}`)
    });
};
var getMotivation = (channelId) => {
  req.end(function (res) {
    if (res.error) {
      console.error(res.error);
      throw new Error(res.error);
    }
    console.log(res.body[0].media);
    sendMessage(
      channelId,
      `Here is a motivational qoute: ${res.body[0].media}`
    );
  });
};

const sendMessage = async (channel, message) => {
  try {
    const result = await web.chat.postMessage({
      channel: channel,
      text: message,
    });
  } catch (error) {
    console.error(error);
  }
  console.log("still sending");
};

(async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);

  console.log(`Listening for events on ${server.address().port}`);
})();
