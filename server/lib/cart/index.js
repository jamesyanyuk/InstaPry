var itemLib = require('../item');

function toString(cart) {
    var output = 'Cart contents: ';
    for(var item in cart) {
        output += ('\n' + itemLib.getName(item.item_id)
            + ' @ ' + itemLib.getAmount(item.item_id)
            + ' x ' + item.quantity);
    }
    return output;
}

function getAmount(cart) {
    var output = 0;
    for(var item in cart) {
        output += (parseInt(itemLib.getAmount(item.item_id)) * item.quantity);
    }
    return output;
}

exports.toString = toString;
exports.getAmount = getAmount;