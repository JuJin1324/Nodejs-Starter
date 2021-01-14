let User = require('../models/user'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth20')
;

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err || !user) return done(err, null);
        done(null, user);
    });
});

module.exports = (app, options) => {
    if (!options.successRedirect)
        options.successRedirect = '/account';
    if (!options.failureRedirect)
        options.failureRedirect = '/login';

    return {
        init: () => {
            let env = app.get('env');
            let config = options.providers;

            /* configure Google strategy */
            passport.use(new GoogleStrategy({
                clientID: config.google[env].appId,
                clientSecret: config.google[env].appSecret,
                callbackURL: '/auth/google/callback'
            }, (accessToken, refreshToken, profile, done) => {
                let authId = `google:${profile.id}`;
                User.findOne({authId: authId}, (err, user) => {
                    if (err) return done(err, null);
                    if (user) return done(null, user);
                    user = new User({
                        authId: authId,
                        name: profile.displayName,
                        created: Date.now(),
                        role: 'customer',
                    });
                    user.save(err => {
                        if (err) return done(err, null);
                        done(null, user);
                    });
                });
            }));

            app.use(passport.initialize());
            app.use(passport.session());
        },
        registerRoutes: () => {
            /* register Google routes */
            app.get('/auth/google', (req, res, next) => {
                if (!req.query.redirect) req.query.redirect = '';
                passport.authenticate('google', {
                    scope: ['profile'],
                    // callbackURL: `/auth/google/callback?redirect=${encodeURIComponent(req.query.redirect)}`
                    /* Google OAuth 의 경우 callback URL에 URL 조각, 상대 경로, 와일드 카드는 포함할 수 없음 */
                    callbackURL: `/auth/google/callback`
                })(req, res, next);
            });

            app.get('/auth/google/callback',
                passport.authenticate('google', {failureRedirect: options.failureRedirect}),
                (req, res) => {
                    res.redirect(303, req.query.redirect || options.successRedirect);
                }
            );
        },
    };
};
