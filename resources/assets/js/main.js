const dis = .20;
function checkRate(rate, discount = dis) {
    return rate - (rate * discount);
}
console.log(checkRate(100));