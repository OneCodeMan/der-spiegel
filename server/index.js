const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const cors = require('cors');
const _ = require('lodash');
const YouTube = require('simple-youtube-api');
const apiKey = require('./secrets');
const youtube = new YouTube(apiKey.apiKey);

const app = express();
const pdfTemplate = require('./documents');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var getSubtitles = require('youtube-captions-scraper').getSubtitles;

const finalPdfName = 'result.pdf';

function getVideoId(link) {
  let indexBeforeVideoId = link.indexOf("v=");
  let firstIndexVideoId = indexBeforeVideoId + 2;
  let lastIndexVideoId = indexBeforeVideoId + 13;
  let completeVideoId = link.substring(firstIndexVideoId, lastIndexVideoId);
  return completeVideoId;
}
// TODO: Bloated AF. Clean up! This smells.
function getWordFrequencyMap(words) {
  let wordFrequency = {};
  words.forEach(function (key) {
    if (wordFrequency.hasOwnProperty(key)) {
      wordFrequency[key]++;
    } else {
      wordFrequency[key] = 1;
    }
  });
  // console.log(wordFrequency);
  var orderedWordFrequency = [];
  orderedWordFrequency = Object.keys(wordFrequency).map(function (key) {
    return {
      name: key,
      total: wordFrequency[key]
    };
  });

  orderedWordFrequency.sort(function (a, b) {
    return b.total - a.total;
  });
  return orderedWordFrequency;
}

function addLineBreak(captionList) {
  return captionList.push('<br/><br/>');
}

app.post('/create-pdf', (req, res) => {
  // console.log(req.body.content);
  //console.log(req.body);
  let completeVideoId = getVideoId(req.body.link);
  //console.log('complete video Id:', completeVideoId);
  console.log('request body in /create-pdf:', req.body);

    youtube.getVideo(req.body.link)
    .then(video => {
        //console.log(`The video's title is ${video.title}`);
        getSubtitles({
          videoID: completeVideoId,
          lang: req.body.lang.toLowerCase(),
        }).then(function(captions) {
          let captionsWithoutMusic = _.remove(captions, function(caption) {
                                      return !caption.text.startsWith('[');
                                     });
          let textValuesFromCaptions = _.map(captionsWithoutMusic, 'text');
          // console.log(textValuesFromCaptions); // ['First caption', 'Second Caption', 'etc']

          let textValuesFromCaptionsChunks = _.chunk(textValuesFromCaptions, 10); // [['test', 'hi'], ['sunny', 'sky', 'etc']]
          // console.log('text values from caption chunks: ', textValuesFromCaptionsChunks);

          textValuesFromCaptionsChunks.forEach(addLineBreak);
          let captionChunksFlattened = _.flatten(textValuesFromCaptionsChunks);

          let transcript = captionChunksFlattened.join(' '); // First caption Second Caption etc

          // THIS IS FOR THE WORD FREQUENCY
          let transcriptAsArrayOfWords = transcript.split(" ");
          // console.log(transcriptAsArrayOfWords);

          let wordFrequency = getWordFrequencyMap(transcriptAsArrayOfWords);

          // console.log(transcript);
          let transcriptAsObject = {
            channel: video.raw.snippet.channelTitle,
            title: video.title, 
            transcript: transcript,
            wordFrequency: wordFrequency, 
          };
          // console.log(transcriptAsObject);

          pdf.create(pdfTemplate(transcriptAsObject), {}).toFile(finalPdfName, (err) => {
            if(err) {
                res.send(Promise.reject());
            }
            res.send(Promise.resolve());
          });
        });
    })
    .catch(console.log);
  
});

app.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/${finalPdfName}`);
})

app.listen(port, () => console.log(`Listening on port ${port}`));