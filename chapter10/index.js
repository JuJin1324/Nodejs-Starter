const express = require('express');
const basicAuth = require('express-basic-auth');
let compression = require('compression');

let app = express();

app.set('port', process.env.PORT || 3000);
app.use(compression(null));

app.use(basicAuth({
    users: {'admin': '1234'},
    challenge: true,    /* true: browser shows the prompt for UI */
}));

app.get('/', (req, res) => {
    res.send('abcd');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
});
