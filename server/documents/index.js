module.exports = ({ title, channel, transcript }) => {

return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>${channel} - ${title}</title>
          <style>
            .container {
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