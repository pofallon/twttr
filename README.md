# twttr
Minimal Twitter API client

Based on the [twine](https://github.com/pofallon/twine) sample created in the [Building Command Line Applications in Node.js](https://www.pluralsight.com/courses/node-js-building-command-line-app) Pluralsight course.

## Usage

Install with `npm install --save twttr` then:

```
const { TwitterClient } = require('twttr')

const t = new TwitterClient({
  consumerKey: 'abc123',
  consumerSecret: 'abc123',
  accessToken: 'abc123',
  accessTokenSecret: 'abc123'
})

t.get('1.1/account_activity/all/webhooks.json')
  .then(results => console.log(JSON.stringify(results.data,null,4)))
  .catch(error => console.log(error))
```