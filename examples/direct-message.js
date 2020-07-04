const { TwitterClient } = require('../index')

let twitter = new TwitterClient({ 
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

twitter.post('1.1/direct_messages/events/new.json', {
  "event": {
    "type": "message_create",
    "message_create": {
      "target": { "recipient_id": process.env.TWITTER_DM_RECIPIENT },
      "message_data": { "text": "Hello from twttr!" }
    }
  }
})
.then(response => console.log(JSON.stringify(response.data, null, 2)))
.catch(e => console.log(JSON.stringify(e.response.data, null, 2)))