module.exports = ({ transcript }) => {
    const today = new Date();
return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <h1>Your Video :)</h1>
             <p>${transcript}</p>
          </div>
       </body>
    </html>
    `;
};