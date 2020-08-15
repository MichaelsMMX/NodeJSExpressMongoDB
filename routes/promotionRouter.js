const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res) => {
    res.send('Will send all the promotions to you');
})

.post((req, res) => {
    res.send(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
})

.put((req, res) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /promotions');
})

.delete((req, res) => {
    res.send('Deleting all promotions');
});

promotionRouter.route('/:promotionId')

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res) => {
    res.send(`Will send details of the promotions: ${req.params.promotionId} to you`);
})

.post((req, res) => {
    res.statusCode = 403;
    res.send(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`);
    res.send(`Will update the promotion: ${req.body.name}
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.send(`Deleting promotion: ${req.params.promotionId}`);
});

module.exports = promotionRouter;