exports.inc = function(n, callback, timeout) {
    timeout = timeout || 200;
    setTimeout(function() {
        callback(null, n+1);
    }, timeout);
};

exports.slow_fn = function(x, y, callback) {
    // console.log('start working for: ' + x+','+y);
    // console.log('finished: ' + x+','+y);
    // callback(null, 'im slow for: '+x+','+y);
};

// exports.fire = function(obj, callback, timeout) {
//     timeout = timeout || 200;
//     setTimeout(function() {
//         callback(null, obj);
//     }, timeout);
// };

// exports.err = function(errMsg, callback, timeout) {
//     timeout = timeout || 200;
//     setTimeout(function() {
//         callback(errMsg);
//     }, timeout);
// };

// // utils
// exports.log = function(msg, obj) {
//     process.stdout.write(moment().format('ss.SSS')+'> ');
//     if(obj!==undefined) {
//         process.stdout.write(msg);
//         console.log(obj);
//     } else {
//         console.log(msg);
//     }
// };

// exports.wait = function(mils) {
//     var now = new Date();
//     while(new Date() - now <= mils);
// };