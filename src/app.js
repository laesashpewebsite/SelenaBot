const { WebClient } = require ('@slack/web-api');

const { createEventAdapter } = require('@slack/events-api');

const dotenv =require("dotenv");
dotenv.config();

const web = new WebClient(process.env.SLACK_OAUTH_TOKEN);
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

const port = process.env.PORT || 3000;


slackEvents.on('message', (event) => {
        if(event.text==="H"){

            console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
        // hello(event.channel, event.user)
        }
        else {
            hello( event.channel,event.user,event.text)
            console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
            // console.log(event.channel.info)
        }
        console.log("ending")
    return;
})


function hello (channelId, userId, text) {
    var string = text;
    sendMessage(channelId, `Heya! <@${userId}>: ${string}`);
    
    return;
}

const sendMessage = async (channel, message) =>{
    
    try{ 
        const result = await web.chat.postMessage({
        channel: channel,
        text: message,
    });
        console.log(`Successfully sent message ${result.ts} in conversation ${channel}`);

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
    console.log(`Listening for events on ${server.address().port}`);
})();

