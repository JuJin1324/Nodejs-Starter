const express = require('express');

let app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.send('<h1>Index Page.</h1>');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
});