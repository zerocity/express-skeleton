exports.getPercentage = function getPercentage(value) {
    var percent = 10;

    return Math.round(parseInt(value) + parseInt(value) / parseInt(percent));
};
