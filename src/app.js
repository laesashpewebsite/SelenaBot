import axios from 'axios';

const { WebClient } = require("@slack/web-api");

const { createEventAdapter } = require("@slack/events-api");

const dotenv = require("dotenv");
dotenv.config();

const web = new WebClient(process.env.SLACK_OAUTH_TOKEN);
const slackSigningSecret = '01a534dff903a715e2fffd031114765f';
const slackEvents = createEventAdapter(slackSigningSecret);

const port = process.env.PORT || 3000;
const SelenaBotId = process.env.SELENABOTID;
const eboardId_1="";
const eboardId_2="";
const eboardId_3="";
const eboardId_4="";
const eboardId_5="";
const opId  =process.env.OPID; //ostavo's user  id 

var unirest = require("unirest");


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
  // console.log(event.user.name);
  var tempString = event.text;
  var userId = event.user;
  var channelId = event.channel;
  tempString = tempString.toUpperCase();
  if ( userId !== SelenaBotId) {
    // this is to prevent from sending messages when the bot detects itself and
    //when @Selena  bot is not detected
    if (tempString.includes(`HELP`)) 
    {
      //ENABLE THIS COMMENT TO POST TO SLACK
      sendMessage( channelId, `Can't help you yet but I can tell you, you are awesome`);
      helpText(channelId,userId);
    } 
    else if (tempString.includes(`EVENT`))
    {
      defaulText(channelId);
      // eventText(channelId, userId)
    } 
    else if (tempString.includes(`SHOW SCHOLARSHIP`)) 
    {
      scholarshipText(channelId, userId);
    } 
    else if (tempString.includes(`POST SCHOLARSHIP`)) 
    {
      postScholarships(channelId, userId, tempString.split("/"));
    } 
    else if (tempString.includes(`MOTIVATE`)) 
    {
      getMotivation(channelId);
    }
    else if (tempString.includes(`UPDATE USER`)) 
    {
      // getMotivation(channelId);
    } 
    else if(tempString.includes(`SHOW POINT`)){
      getPoints(channelId,userId)  
      // defaulText(channelId, userId);
    }
    else if(tempString.includes(`POST POINT`)){
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
var scholarshipText = (channelId, userId) => {
  var tempString ='\n';
  var scholarships;
  axios
  .get("https://laesa-backend.herokuapp.com/api/scholarships")
  .then((res) => {
      scholarships = res.data;
      // console.log(scholarships);
      
      for (var i=0; i< scholarships.length; i++){
          tempString += `${scholarships[i].title}: ${scholarships[i].description}.\n Due on ${scholarships[i].deadline}`;
          tempString +='\n\n\n';
      }
       //console.log(`Backend connected! @${userId} upcoming scholarships are: ${tempString}`)
       sendMessage(channelId,` <@${userId}> upcoming scholarships are: ${tempString}`)
  });
};
var getPoints = (channelId,userId)=>{
  var tempString ="\n";
  var member;
  axios.get("https://laesa-backend.herokuapp.com/api/member")
  .then( res =>{
    member = res.data;
    for (var i=0;i<member.length;i++){      
      if(member[i].userid == userId){
        tempString += `Name: ${member[i].fullname}\n`;
        tempString += `Status: ${member[i].status}\n`;
        if (member[i].status === "Admin"){ tempString+= "Eboard members don't get points "}
        else {tempString += `Current Points: ${member[i].points}`;}
        tempString +="\n\n";
        console.log(member[i]);
      }
    }
    if(tempString==='\n'){
      tempString+='User not found, inform Eboard you are not in the system :)'
    }
  sendMessage(userId, tempString)
  })
  .catch(err => {
    console.error(err);
  })  
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
     show scholarship\n 
     motivate \n 
     events\n 
     post scholarship\n
     post point\n
     show point`;
    sendMessage(channelId,helpString);
    // sendMessage(channelId,`also, you are awesome <@${userId}>`);

};
var postScholarships = (channelId, userId, tempString)=>{
    // onnly eoard memebrs can usepost functions these are the ids for Kyle, Mino and Richard. 
    //need Alex
    if(userId === "UCV8N5FK4" || userId === "UDZFPJPQW" || userId === "UFVNKM6MV" || userId == "UNLNKNE3C"){ 
      axios
      .post("https://laesa-backend.herokuapp.com/api/scholarships",
      {
        title:tempString[1],
        description:tempString[2],
        deadline:tempString[3]
      })
      .then( res =>{
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      })
    }
    else{
      sendMessage(channelId,"You don't have authority to post only Eboard members can post")
    }
} 
var getMotivation = (channelId) => {
  req.end(function (res) {
    if (res.error) {
      console.error(res.error);
      throw new Error(res.error);
    }
    // console.log(res.body[0].media);
    sendMessage(
      channelId,
      `Here is a motivational quote: ${res.body[0].media}`
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
};

(async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);

    // postScholarships('1','2','@seleanbot /title /ths is the description /'.split('/'));
  // scholarshipText('1','2');
  console.log(`Listening for events on ${server.address().port}`);
})();
