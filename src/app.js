import axios from "axios";

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

let scholarships = {};

var req = unirest("GET", "https://healthruwords.p.rapidapi.com/v1/quotes/");

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
  tempString = tempString.toUpperCase();
  if (event.user !== SelenaBotId) {
    // this is to prevent from sending messages when te bot detects itself and
    //when @Selena  bot is not detected
    if (tempString.includes(`/HELP`)) {
      //ENABLE THIS COMMENT TO POST TO SLACK
      sendMessage(
        event.channel,
        `Can't help you yet but I can tell you, you are awesome`
      );
      // console.log('in help')
    } else if (tempString.includes(`/EVENT`)) {
      //ENABLE THIS COMMENT TO POST TO SLACK
      sendMessage(
        event.channel,
        `Can't help you yet but you can ask your amazing Eboard in the meantime!`
      );
      // console.log('in events');
    } else if (tempString.includes(`/SCHOLARSHIP`)) {
      scholarshiptext();
    } else if (tempString.includes(`/MOTIVATE`)) {
      getMotivation(event.channel);
    } else {
      // sendMessage(event.channel,`Did you want something? would you like for me to display the help list?`);
    }
  }
});
// eventText = (channelId, userId) => {
//   //This function will do is it will output all the upcoming events
//   //within a 2 week time span. Display their information accordingly like so:
//   // "Events_name is on Events_date: Events_description this event is worth this
//   // events is under Event_category so you will get Events_point if you attend"
// };
// helpText = (channelId, userId) => {
//   //This function will output a list of potential commands so people can see how
//   //SELENA Bot
// };
scholarshiptext = (channelId) => {
  axios
    .get("https://laesa-backend.herokuapp.com/api/scholarships")
    .then((res) => {
      scholarships = res.data;
      console.log(scholarships);
    });
};
getMotivation = (channelId) => {
  console.log("in moti");
  req.end(function (res) {
    if (res.error) {
      console.error(res.error);
      throw new Error(res.error);
    }
    // var body = res.body;
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
    // console.log(`Successfully sent message ${result.ts} in conversation ${channel}`);
  } catch (error) {
    console.error(error);
  }
  console.log("still sending");
};

(async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);

  // Log a message when the server is ready
  // getMotivation();
  console.log(`Listening for events on ${server.address().port}`);
})();
