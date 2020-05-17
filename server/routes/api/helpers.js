module.exports = {
    getVideoId: function(link) {
        let indexBeforeVideoId = link.indexOf("v=");
        let firstIndexVideoId = indexBeforeVideoId + 2;
        let lastIndexVideoId = indexBeforeVideoId + 13;
        let completeVideoId = link.substring(firstIndexVideoId, lastIndexVideoId);
        return completeVideoId;
    },
    getWordFrequencyMap: function(words) {
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
    },
    addLineBreak: function(captionList) {
        return captionList.push('<br/><br/>');
    }
}