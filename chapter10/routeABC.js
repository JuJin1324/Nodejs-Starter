let express = require('express');

let app = express();
app.set('port', process.env.PORT || 3000);

/* Travel for route '/a'
 * ALLWAYS
 * /a: route terminated
 * display in client: a
 */

/* Travel for route '/b'
 * ALLWAYS
 * /b: route not terminated
 * SOMETIMES
 * /b (part 2): error thrown
 * /b error detected and passed on
 * unhandled error detected: b failed
 * display in client: 500 - server error
 */

/* Travel for route '/c'
 * ALLWAYS
 * SOMETIMES
 * /c: error thrown
 * /c: error detected but not passed on
 * route not handled
 * display in client: 404 - not found
 */
app.use((req, res, next) => {
    console.log(`from ${req.url}`);
    console.log('\n\nALLWAYS');
    next();
});

app.get('/a', (req, res) => {
    console.log('/a: route terminated');
    res.send('a');
});

app.get('/b', (req, res, next) => {
    console.log('/b: route not terminated');
    next();
});

app.use((req, res, next) => {
    console.log('SOMETIMES');
    next();
});

app.get('/b', (req, res, next) => {
    console.log('/b (part 2): error thrown');
    throw new Error('b failed');
});

app.use('/b', (err, req, res, next) => {
    console.log('/b error detected and passed on');
    next(err);
});

app.get('/c', (err, req) => {
    console.log('/c: error thrown');
    throw new Error('c failed');
});

app.use('/c', (err, req, res, next) => {
    console.log('/c: error detected but not passed on');
    next();
});

app.use((err, req, res, next) => {
    console.log(`unhandled error detected: ${err.message}`);
    res.send('500 - server error');
});

app.use((req, res) => {
    console.log('route not handled');
    res.send('404 - not found');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
});
