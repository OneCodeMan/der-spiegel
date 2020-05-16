var getSubtitles = require('youtube-captions-scraper').getSubtitles;
var sampleID = '86JRjxxKxGQ';

getSubtitles({
    videoID: sampleID,
    lang: 'de',
  }).then(function(captions) {
    console.log(captions);
  });