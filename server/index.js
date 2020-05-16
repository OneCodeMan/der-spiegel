const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const cors = require('cors');
const _ = require('lodash');

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

app.post('/create-pdf', (req, res) => {
  // console.log(req.body.content);
  //console.log(req.body);
  let completeVideoId = getVideoId(req.body.link);
  //console.log('complete video Id:', completeVideoId);
  console.log('request body in /create-pdf:', req.body);
  getSubtitles({
    videoID: completeVideoId,
    lang: req.body.lang,
  }).then(function(captions) {
    // console.log(captions);
    let textValuesFromCaptions = _.map(captions, 'text');
    // console.log(textValuesFromCaptions); // ['First caption', 'Second Caption', 'etc']
    let transcript = textValuesFromCaptions.join(' '); // First caption Second Caption etc
    // console.log(transcript);
    let transcriptAsObject = { transcript: transcript };
    pdf.create(pdfTemplate(transcriptAsObject), {}).toFile(finalPdfName, (err) => {
      if(err) {
          res.send(Promise.reject());
      }
      res.send(Promise.resolve());
    });
  });
  
});

app.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/${finalPdfName}`);
})

app.listen(port, () => console.log(`Listening on port ${port}`));