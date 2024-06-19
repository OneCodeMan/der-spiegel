const express = require('express');
const router = express.Router();
const helpers = require('./helpers');
const pdfTemplate = require('../../documents');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyC8Cq0g29px8HoGn5ZwT3JmKrq5xOseStQ");

const _ = require('lodash');

const pdf = require('html-pdf');
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
const finalPdfName = 'result.pdf';

router.post('/create-pdf', (req, res) => {
    console.log(req.body.content);
    console.log(req.body);
    let completeVideoId = helpers.getVideoId(req.body.link);
    console.log('complete video Id:', completeVideoId);
    console.log('request body in /create-pdf:', req.body);

    youtube.getVideo(req.body.link)
    .then(video => {
        console.log(`The video's title is ${video.title}`);
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

        textValuesFromCaptionsChunks.forEach(helpers.addLineBreak);
        let captionChunksFlattened = _.flatten(textValuesFromCaptionsChunks);

        let transcript = captionChunksFlattened.join(' '); // First caption Second Caption etc

        // THIS IS FOR THE WORD FREQUENCY
        let transcriptAsArrayOfWords = transcript.split(" ");
        // console.log(transcriptAsArrayOfWords);

        let wordFrequency = helpers.getWordFrequencyMap(transcriptAsArrayOfWords);

        // console.log(transcript);
        let transcriptAsObject = {
            channel: video.raw.snippet.channelTitle,
            title: video.title, 
            transcript: transcript,
            // wordFrequency: wordFrequency, 
        };
        // console.log(transcriptAsObject);
        // console.log(transcriptAsObject);

        pdf.create(pdfTemplate(transcriptAsObject), {}).toFile(`routes/api/${finalPdfName}`, (err) => {
            if(err) {
                res.send(Promise.reject());
            }
            res.send(Promise.resolve());
        });
        });
    })
    .catch(console.log(""));
});
  
router.get('/fetch-pdf', (req, res) => {
    let fileLocation = `${__dirname}/${finalPdfName}`;
    res.sendFile(fileLocation);
});
  
module.exports = router;