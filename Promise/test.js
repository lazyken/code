let Promise = require('./promise');
console.log(Promise);
let p = new Promise((resolve, reject) => {
  resolve(100);
});

let p2 = p.then((data) => {
  return p2;
});

p2.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);
