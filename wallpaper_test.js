let json = require('./test_json.json');

console.log(json.items[0].url);

let one = undefined;
let two = 'ssf';

let three = one ? one : two;

console.log(three);