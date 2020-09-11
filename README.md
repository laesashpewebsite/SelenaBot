# SelenaBot :woman_dancing:

## Things You will need to install 
1. Ngrok for temporary http posting
    * https://ngrok.com/
2.  Node Modules 
    * `npm install`
3. If you are part of the team Ask @topsm for the credentials necessary for the environment variables 

## How To Run 
1. Create your .env file and include the tokens for 
    `SLACK_OAUTH_TOKEN = 'your-token'`
    `SLACK_SIGNING_SECRET= 'your-signing-secret'`

2. In your terminal directory for ngrok run :
    `./ngrok http 3000`
3. Go to https://api.slack.com/ and go to your appropiate bot ->  Event Subscription -> Enable Events 
4. run `npm start` in the directory for Selena Bot 
5. Paste the **https** link from ngrok onto requested URL
6. Start testing! :smiley:

### Resources we can use
1. https://api.slack.com/events