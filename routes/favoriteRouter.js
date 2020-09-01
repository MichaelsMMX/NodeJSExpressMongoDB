const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router()

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user._id)
    Favorite.findOne({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorite => {
        console.log('get')
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            req.body.campsites.forEach (campsite => {
                if(!favorite.campsites.includes(campsite._id)) {
                    favorite.campsites.push(campsite._id)
                }
            });
            favorite.save()
            .then(favorite => {
                res.send(favorite)
            })
            .catch(err => next(err));
        } else {
            console.log(req.body);
            Favorite.create({
                user: req.user._id,
                campsites: req.body
            })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }        
    })
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            favorite.remove()
            .then(favorite => {
                res.send(favorite)
            })
            .catch(err => next(err));
        } else {
            res.send('No favorites found');
        }
    })
    .catch(err => next(err));
});

// campsiteID Favorites

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            if(!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId)
                    favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }) 
                    .catch(err => next(err));
            } else {
                res.send('The campsite is already in Favorites');
            }
        } else {
            console.log(req.body);
            Favorite.create({
                user: req.user._id,
                campsites: [req.params.campsiteId]
            })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }                     
    })
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            var index = favorites.campsites.indexOf(req.params.campsiteId)
            if (index != -1) {                
                favorite.campsites.splice(index, 1)
                favorite.save()
                .then(favorite => {
                    res.send(favorite)
                })
                .catch(err => next (err));
            } else {
                res.send('Campsite not found');
            }
        } else {
            res.send('No favorites found');
        }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;