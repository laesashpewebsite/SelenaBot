const { WebClient } = require ('@slack/web-api');

const { createEventAdapter } = require('@slack/events-api');

const dotenv =require("dotenv");
dotenv.config();

const web = new WebClient(process.env.SLACK_OAUTH_TOKEN);
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

const port = process.env.PORT || 3000;
const SelenaBotId = "U01A6KT325R";

var unirest = require("unirest");

var req = unirest("GET", "https://healthruwords.p.rapidapi.com/v1/quotes/");

req.query({
	"maxR": "1",
});

req.headers({
	"x-rapidapi-host": "healthruwords.p.rapidapi.com",
	"x-rapidapi-key": "3bc797064dmsh88cd64ba177bd18p15ebc0jsn41321cd9714e",
	"useQueryString": true
});

// can't figure out how to do replies

slackEvents.on('app_mention', (event) => {

        var tempString = event.text; 
        tempString = tempString.toUpperCase()        
        if(event.user !== SelenaBotId ){
            // this is to prevent from sending messages when te bot detects itself and 
            //when @Selena  bot is not detected in string
            if(tempString.includes(`/HELP`)){
                //ENABLE THIS COMMENT TO POST TO SLACK
                // console.log('in help')
                helpText(event.channel,event.user);
            }
            else if(tempString.includes(`/EVENT`)  ){
                eventText(event.channel,event.user);
            }    
            else if(tempString.includes(`/POINTS`)){}
            else if(tempString.includes(`/MOTIVATE`)){
                 getMotivation(event.channel);
            }
            else if(tempString.includes(`/SCHOLARSHIP`)){
                scholarshiptext(event.channel,event.user);
           }
            else{
                sendMessage(event.channel,`Hola, Did you want something?`);
                helpText(event.channel,event.user);                
            }
        }
})
eventText = (channelId,userID) =>{
    //This function will do is it will output all the upcoming events 
    //within a 2 week time span. Display their information accordingly like so:
    // "Events_name is on Events_date: Events_description this event is worth this
    // events is under Event_category so you will get Events_point if you attend" 

     //ENABLE THIS COMMENT TO POST TO SLACK
     sendMessage(channelId, `Hi @${userID}, I can't help you right now with that, but you can ask your amazing Eboard in the meantime!`);
                
}
helpText = (channelId,userID) => {
    var helpString = `these are my current list of commands: \n
     /scholarships\n 
     /motivate \n 
     /events\n `;
    sendMessage(channelId,helpString);
    sendMessage(channelId,`also, you are awesome @${userID}`);
}

scholarshiptext = (channelId,userID) =>{
    var ssString =  `I do not have the list yet but you are definitely worth all the scholarships @${userID}`
    // This fucntion will provide a list of all available scholarships 
    // and their due date:
    //"Scholarship_name - Scholarship_info: Scholarship_dueDate"
    sendMessage(channelId,ssString);

}
getMotivation = (channelId) =>{
    
    // console.log("in moti")
    req.end(function (res) {
        if (res.error) 
        {
            console.error(res.error)
            throw new Error(res.error);
        }
        // var body = res.body;
        // console.log(res.body[0].media);
        sendMessage(channelId, `Here is a motivational quote: ${res.body[0].media}`);
    });
}


const sendMessage = async (channel, message) =>{
    
    try{ 
        const result = await web.chat.postMessage({
        channel: channel,
        text: message,
    });
        // console.log(`Successfully sent message ${result.ts} in conversation ${channel}`);

    }
    catch(error){
    console.error(error);
    }
    console.log("still sending");
}

(async () => {
    // Start the built-in server
    const server = await slackEvents.start(port);
   
    // Log a message when the server is ready
    // getMotivation();
    console.log(`Listening for events on ${server.address().port}`);

})();

