//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use('/', express.static('infinite-scrolling-message-list'));

app.get('*', (req,res,next) => {
    const indexFile = path.resolve(__dirname + '/Infinite-Scrolling-Message-List/index.html');
    res.sendFile(indexFile);
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);