let Attraction = require('../models/attraction');
const logger = require('../config/logger');

exports.getAttractions = (req, res) => {
    Attraction.find({approved: true}, (err, attractions) => {
        if (err) {
            res.json({error: 'Internal error.',});
        } else {
            res.json(attractions.map(attraction => {
                return {
                    name: attraction.name,
                    description: attraction.description,
                    location: attraction.location,
                };
            }));
        }
    });
};

exports.postAttraction = (req, res) => {
    let attraction = new Attraction({
        name: req.body.name,
        description: req.body.description,
        location: {lat: req.body.lat, lng: req.body.lng},
        history: {
            event: 'created',
            email: req.body.email,
            date: new Date(),
        },
        approved: false,
    });

    Attraction.updateOne(
        {name: attraction.name},
        {$set: attraction},
        {upsert: true},
        err => {
            if (err) {
                logger.error(`Unable to add attraction: ` + err);
                Attraction.findOne(
                    {name: attraction.name},
                    null,
                    null,
                    (err, doc) => {
                        if (err) {
                            logger.error('Unable to retrieve doc: ' + err);
                            res.json({error: 'Unable to retrieve doc.'});
                        } else {
                            if (doc) {
                                logger.info('doc._id: ' + doc._id);
                                res.json({id: doc._id});
                            } else {
                                res.json({});
                            }
                        }
                    }
                );
                // res.json({error: 'Unable to add attraction.'});
            } else {
                logger.info('attraction._id: ' + attraction._id);
                res.json({id: attraction._id});
            }
        }
    );
    // attraction.save((err, attraction) => {
    //     if (err) {
    //         logger.error('Unable to add attraction: ' + err);
    //         res.json({error: 'Unable to add attraction.'});
    //     } else {
    //         res.json({id: attraction.id});
    //     }
    // });
};

exports.getAttractionWithParams = (req, res) => {
    Attraction.findOne(
        {
            _id: req.params.id,
            approved: true
        },
        null,
        null,
        (err, attraction) => {
            if (err) {
                logger.error('Unable to retrieve attraction: ' + err);
                res.json({error: 'Unable to retrieve attraction.'});
            } else {
                if (attraction) {
                    res.json({
                        name: attraction.name,
                        description: attraction.description,
                        location: attraction.location,
                    });
                } else {
                    res.json({});
                }

            }
        }
    );
};

exports.postApproveAll = (req, res) => {
    Attraction.updateMany(
        {approved: false},
        {$set: {approved: true}},
        null,
        (err, doc) => {
            if (err) {
                logger.error('Unable to update attraction: ' + err);
                res.json({error: 'Unable to update attraction.'});
            } else {
                res.json({id: req.params.id});
            }
        }
    );
};
