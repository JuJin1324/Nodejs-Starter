let fs = require('fs'),
    formidable = require('formidable')
;

/* make sure data directory exists */
let dataDir = `${__dirname}/../data`;
let vacationPhotoDir = dataDir + '/vacation-photo';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(vacationPhotoDir)) fs.mkdirSync(vacationPhotoDir);

const saveContestEntry = (contestName, email, year, month, photoPath) => {

};

module.exports = {
    registerRoutes: function(app) {
        app.get('/contest/vacation-photo', this.getVacationPhoto);
        app.post('/contest/vacation-photo/:year/:month', this.postVacationPhotoWithParams);
    },
    getVacationPhoto: (req, res) => {
        let now = new Date();
        res.render('contest/vacation-photo', {
            year: now.getFullYear(),
            month: now.getMonth()
        });
    },
    postVacationPhotoWithParams: (req, res) => {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) {
                req.session.flash = {
                    type: 'danger',
                    intro: 'Oops!',
                    message: 'There was an error processing your submission. Please try again.'
                };
                return res.redirect(303, '/error');
            }
            let photo = files.photo;
            let dir = `${vacationPhotoDir}/${Date.now()}`;
            let path = `${dir}/${photo.name}`;
            fs.mkdirSync(dir);
            fs.renameSync(photo.path, path);    /* rename 뿐만 아니라 위치까지 옮겨줌. */
            saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path);
            req.session.flash = {
                type: 'success',
                intro: 'Good luck!',
                message: 'You have been entered into the contest.'
            };

            res.redirect(303, '/thank-you');
        });
    }
};
