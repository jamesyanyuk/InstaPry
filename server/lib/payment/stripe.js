var itemLib = require('../item');
var cartLib = require('../cart');

// Temp test secret key (will switch to live eventually)
var stripe = require('stripe')(
    'sk_test_RGucLmtAHXNKr4fnUqwubih3'
);

var sourceToken = {
    object: 'card',
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2017,
    cvc: '123'
};

// Assumption: email is verified!
function createCharge(email, cart, cb) {
    stripe.customers.create({
        // Customer data to store in Stripe (probs email for now)
        // Should instead use Stripe token given by front end versus explicit card details
        email: email,
        source: sourceToken
    }).then(function(customer) {
        // Charge the newly created customer in Stripe
        // Will need to store these orders in db with invoice (invoice id #)
        console.log(cartLib.toString(cart));
        console.log('Amount: ' + cartLib.getAmount(cart));

        return stripe.charges.create({
            customer: customer.id,
            currency: 'usd',
            amount: parseInt(cartLib.getAmount(cart)),
            receipt_email: email,
            description: cartLib.toString(cart),
            metadata: {
                order_id: '0001',
                cart: cart
            }
        });
    }).then(function(charge) {
        cb(undefined, charge);
    }, function(err) {
        switch (err.type) {
            case 'StripeCardError':
                // A declined card error
                err.message; // => e.g. "Your card's expiration year is invalid."
                cb(err);
                break;
            case 'StripeInvalidRequest':
                // Invalid parameters were supplied to Stripe's API
                cb(err);
                break;
            case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                cb(err);
                break;
            case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                cb(err);
                break;
            case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                cb(err);
                break;
        }
    });
}

exports.createCharge = createCharge;