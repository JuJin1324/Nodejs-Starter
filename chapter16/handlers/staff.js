let staff = {
    portland: {
        mitch: {bio: 'Mitch is the man to have at your back.'},
        madeline: {bio: 'Madeline is our Oregon expert.'},
    }, bend: {
        walt: {bio: 'Walt is our Oregon Coast expert.'},
    },
};

exports.getStaff = (req, res, next) => {
    let info = staff[req.params.city][req.params.name];
    if (!info) return next();
    res.json(info);
};
