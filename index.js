const Rx = require('rx');

Rx.Observable.just('Hello World!').subscribe(function (value) {
    console.log(value);
});

// Creating an Observable
var observable = Rx.Observable.create(function (observer) {
    observer.onNext('Simon');
    observer.onNext('Jen');
    observer.onNext('Sergi');
    observer.onCompleted(); // We are done 
});

observable.subscribe(console.log);

// interval and merge operator
var a = Rx.Observable.interval(200).map(function (i) {
    return 'A' + i;
});
var b = Rx.Observable.interval(100).map(function (i) {
    return 'B' + i;
});
// Rx.Observable.merge(a, b).subscribe(function (x) {
//     console.log(x);
// });

// map operator
var logValue = function (val) { console.log(val) };
var src = Rx.Observable.range(1, 5);
var upper = src.map(function (name) {
    return name * 2;
});
upper.subscribe(logValue);

// filter operator
var logValue = function (val) { console.log(val) };
var isEven = (function (val) { return val % 2 === 0; });
var src = Rx.Observable.range(1, 5);
var even = src.filter(isEven);
even.subscribe(logValue);

// reduce operator
var logValue = function (val) { console.log(`reduced value is ${val}`) };
var src = Rx.Observable.range(1, 5);
var sum = src.reduce(function (acc, x) {
    return acc + x;
});
sum.subscribe(logValue);

// scan operator
var avg = Rx.Observable
    .interval(1000)
    .scan(function (prev, cur) {
        return { sum: prev.sum + cur, count: prev.count + 1 };
    }, { sum: 0, count: 0 })
    .map(function (o) {
        return o.sum / o.count;
    });
// var subscription = avg.subscribe(function (x) {
//     console.log(x);
// });

// concatAll
const values$ = Rx.Observable.from([
    Rx.Observable.of(1, 2, 3),
    Rx.Observable.of(4, 5, 6),
    Rx.Observable.of(7, 8, 9)
]);

values$.concatAll().subscribe(v => console.log(v));

// canceling sequences
var counter = Rx.Observable.interval(1000);
var subscription1 = counter.subscribe(function (i) {
    console.log('Subscription 1:', i);
});
var subscription2 = counter.subscribe(function (i) {
    console.log('Subscription 2:', i);
});
setTimeout(function () {
    console.log('Canceling subscription2!');
    subscription2.dispose();
}, 2000);
setTimeout(() => {
    console.log('Canceling subscription1!');
    subscription1.dispose();
}, 3000);

// external api
var p = new Promise(function (resolve, reject) {
    setTimeout(resolve, 5000);
});
p.then(function () {
    console.log('Potential side effect!');
});
var subscription = Rx.Observable.fromPromise(p)
    .subscribe(function (msg) {
        console.log('Observable resolved!');
    });
subscription.dispose();

// error handling
function getJSON(arr) {
    return Rx.Observable.from(arr).map(function (str) {
        var parsedJSON = JSON.parse(str);
        return parsedJSON;
    });
}
getJSON([
    '{"1": 1, "2": 2}',
    '{"success: true}', // Invalid JSON string 
    '{"enabled": true}'
]).subscribe(
    function (json) {
        console.log('Parsed JSON: ', json);
    },
    function (err) {
        console.log(err.message);
    }
);

// error handling using catch
var caught = getJSON(['{"1": 1, "2": 2}', '{"1: 1}'])
    .catch(Rx.Observable.return({
        error: 'There was an error parsing JSON'
    }));
caught.subscribe(
    function (json) {
        console.log('Parsed JSON: ', json);
    },
    // Because we catch errors now, `onError` will not be executed
    function (e) {
        console.log('ERROR', e.message);
    }
);
