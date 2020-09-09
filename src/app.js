const { WebClient } = require ('@slack/web-api');

const { createEventAdapter } = require('@slack/events-api');

const dotenv =require("dotenv");
dotenv.config();

const web = new WebClient(process.env.SLACK_OAUTH_TOKEN);
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

const port = process.env.PORT || 3000;

const SelenaBotId = "U01A6KT325R";

slackEvents.on('message', (event) => {
        var tempString = event.text.toUpperCase(); 
        //converting all strings sent to uppercase value 
        //to easily handle all cases 
        
        var index = tempString.indexOf(`@${SelenaBotId} /`)
        // The bot will first look for the substring "@SelanaBot /"
        //
        if(event.user !== SelenaBotId && index !== -1){
            if(event.text.indexOf('HELP') !== -1){
                sendMessage(event.channel,`Can't help you yet but I can say you 
                                            are awesome`)
            }
            if(event.text.indexOf('EVENT') !== -1  ){
                sendMessage(event.channel, `Can't help you yet but you can ask 
                                            your amazing Eboard in the meantime!`)
            }       

        }
        // else {
        //     // hello( event.channel,event.user,event.text)
        //     console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
        //     // console.log(event.channel.info)
        // }
        console.log("ending")

})


function hello (channelId, userId) {
    sendMessage(channelId, `<@${userId}>  has brought me to life O.O`);
    
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

