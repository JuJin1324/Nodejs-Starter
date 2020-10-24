/* npm install -g express */
let express = require('express');
/* npm install express3-handlebars */
let handlebars = require('express3-handlebars').create({defaultLayout: 'main'});

let app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

let custom404Page = () => {
    app.use((req, res) => {
        res.type('text/plain');
        res.status(404);
        res.send('404 - Not Found');
    });
}

let custom500Page = () => {
    app.use((req, res, next) => {
        console.error(res.error());
        res.type('text/plain');
        res.status(500);
        res.send('500 - Server Error');
    });
}

app.get('/', (req, res) => {
    res.type('text/plain');
    res.send('This is chapter3 index page');
});

app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send('This is chapter3 about page');
});

custom404Page();
custom500Page();
app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
})
