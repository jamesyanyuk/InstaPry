function Item(item_id, quantity) {
    this.item_id = item_id;
    this.quantity = quantity;
}

function getAmount(item_id) {
    // Look up item in item db by item_id
    // Temp:
    return '60';
}

function getName(item_id) {
    return 'Test name';
}

function getDescription(item_id) {
    return 'Test desc';
}

exports.getAmount = getAmount;
exports.getName = getName;
exports.getDescription = getDescription;