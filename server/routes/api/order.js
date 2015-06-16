var express = require('express');
var router = express.Router();

var paymentStripe = require('../../lib/payment/stripe');

/* POST - Create order */
router.post('/', function(req, res) {
    var cart = JSON.parse(req.body.cart);
    var email = req.body.email;
    paymentStripe.createCharge(email, cart, function(err, result) {
        if(err)
            console.log('ERROR: ' + err);
        else
            console.log('RESULT: ' + result);

        return res.end();
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
