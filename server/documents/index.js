module.exports = ({ title, channel, transcript, wordFrequency }) => {

return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>${channel} - ${title}</title>
          <style>
            .container {
               padding: 10px 12px 10px 12px;
            }

            .title-name {
               text-align: center;
            }

            .channel-name {
               text-align: center;
            }
            
            .transcript-text {
               font-size: 20px;
               padding: 0px 20px 0px 20px;
            }

            table, th, td {
               border: 1px solid black;
               border-collapse: collapse;
             }
             th, td {
               padding: 15px;
             }
          </style>
       </head>
       <body>
          <div class="container">
             <h1 class="title-name">${title}</h1>
             <h3 class="channel-name">${channel}</h3>
             <p class="transcript-text">${transcript}</p>
          </div>
       </body>
    </html>
    `;
};