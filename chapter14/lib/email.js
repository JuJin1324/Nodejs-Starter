let nodemailer = require('nodemailer');

module.exports = credentials => {
    let mailTranport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: credentials.gmail.user,
            pass: credentials.gmail.password
        }
    });

    let from = '"Meadowlark Travel" <info@meadowlarktravel.com>';
    let errorRecipient = 'youremail@gmail.com';

    return {
        send: (to, subj, body) => {
            mailTranport.sendMail({
                from: from,
                to: to,
                subject: subj,
                html: body,
                generateTextFromHtml: true
            }, err => {
                if (err) console.error('Unable to send email: ' + err);
            });
        },
        emailError: (message, filename, exception) => {
            let body = '<h1>Meadowlark Travel Site Error</h1>' +
                'message:<br/><pre>' + message + '</pre><br/>';
            if (exception) body += 'exception:<br/><pre>' + exception + '</pre><br/>';
            if (filename) body += 'filename:<br/><pre>' + filename + '</pre><br/>';
            mailTranport.sendMail({
                from: from,
                to: errorRecipient,
                subject: 'Meadowlark Travel Site Error',
                html: body,
                generateTextFromHtml: true
            }, err => {
                if (err) console.error('Unable to send email: ' + err);
            });
        },
        VALID_EMAIL_REGEX: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
    };
};
