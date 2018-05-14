# node.js練習用のTwitterボット

### 前提
社内のLT会にてネタ要員としての登壇時にサンプルとして作成致しました。
[slides](http://slides.com/kazukitahara-1/deck-5)←がLT時に使用したスライドになります。

### 作成した流れ
未経験の新入社員（18年新卒）に向けて、フロントエンド領域に興味を持ってもらえる一旦になればという想いからキャッチー（？）なテーマになるようにTwitterbotをテーマとしました。

### 仕組み
AWSのLambdaにてnode.jsを1時間毎に発火させております。

### Twitterアカウント
実際に当ソースで動いている[Twitterアカウント](https://twitter.com/ssp_lnc)が←になります。

### ディレクトリ構成
※主要構成以外は割愛

| ディレクトリ名 |　説明 |
| -- | -- |
| img | twitterに投稿される画像が格納されている |
| json | twitterに投稿されるツイート文/imgのpathが記載されているjsonが格納されている |
| js | node.js上で実際にツイートを行う関数が格納されている |

### codeの説明

```javascript

//npm module
const Twitter = require('twitter');①

// twitter API②
const twitter = new Twitter({
  consumer_key:'consumer_key',
  consumer_secret:'consumer_secret',
  access_token_key:'access_token_key',
  access_token_secret:'access_token_secret'
});

// node etc③
const fs = require('fs');
const path = require('path');
const json = require('../json/main');
const tweetArray = json.data;

④
const tweetInfo = tweetArray[Math.floor(Math.random()* tweetArray.length)];
const { img, tweet } = tweetInfo;
const imgRoot = path.resolve(__dirname, `../${img}`);
⑤
const gorillaImg = fs.readFileSync(imgRoot);
const media = { "media":gorillaImg };

⑥
const main = async () => {
  const upMedia = await twitter.post('media/upload', media);
  await twitter.post('statuses/update', {status:tweet,media_ids:upMedia.media_id_string});
};
⑦
main();

```
1. ①　node.jsでtwitterAPIを使用できるようにするためのmodulesをimport
1. ②　twitterAPIを使用するためのkeyをtwitterにて登録（非公開keyの為、実際のkey_codeは伏せております）
1. ③　必要となるnodeの関数や外部ファイルをimport
1. ④　取り込んだjsonファイルからMath.randomの乱数で指定されたindexの配列を取得し、投稿するツイート文の準備
1. ⑤　投稿を行う画像の準備
1. ⑥　非同期処理で⑤で設定した画像をアップロード、画像のアップロードが完了後、④で設定したツイート文とアップロードした画像をPOST
1. ⑦ ⑥で設定した関数を呼び出し

上記をLambdaにセットし、１時間毎に発火させている。


