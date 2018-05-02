//npm module
const Twitter = require('twitter');

// twitter API
const twitter = new Twitter({
  consumer_key:'consumer_key',
  consumer_secret:'consumer_secret',
  access_token_key:'access_token_key',
  access_token_secret:'access_token_secret'
});

// node etc
const fs = require('fs');
const path = require('path');
const json = require('../json/main');
const tweetArray = json.data;

const tweetInfo = tweetArray[Math.floor(Math.random()* tweetArray.length)];
const { img, tweet } = tweetInfo;
const imgRoot = path.resolve(__dirname, `../${img}`);

const gorillaImg = fs.readFileSync(imgRoot);
const media = { "media":gorillaImg };

const main = async () => {
  const upMedia = await twitter.post('media/upload', media);
  await twitter.post('statuses/update', {status:tweet,media_ids:upMedia.media_id_string});
};

main();