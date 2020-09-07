// let Promise = require('./promise');
// let p = new Promise((resolve, reject) => {
//   resolve(100);
// });

const Promise = require('./promise');
// let p2 = p.then((data) => {
//   return p2;
// });

// p2.then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.log(err);
//   }
// );

// let p = new Promise.all([1, 2, 3, 4, 5, 6]).then((values) => {
//   console.log(values);
// });

let p = Promise.race([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2s');
      resolve(2);
    }, 2000);
  }),
  setTimeout(() => {
    console.log('1s');
  }, 1000),
  setTimeout(() => {
    console.log('4s');
  }, 4000),
]).then((data) => {
  console.log('data', data),
    (err) => {
      console.log('err', err);
    };
});
