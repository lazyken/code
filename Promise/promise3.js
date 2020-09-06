const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';
function Promise(executor) {
  var self = this;
  self.status = PENDING;
  self.value = undefined;
  self.reason = undefined;
  self.onResolvedCallBacks = [];
  self.onRejectedCallBacks = [];
  function resolve(value) {
    if (self.status === PENDING) {
      self.status = RESOLVED;
      self.value = value;
      self.onResolvedCallBacks.forEach((cb) => cb());
    }
  }
  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = reason;
      self.onRejectedCallBacks.forEach((cb) => cb());
    }
  }
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  let self = this;
  onResolved = typeof onResolved === 'function' ? onResolved : (val) => val;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (err) => {
          throw err;
        };
  let nextPromise = new Promise((resolve, reject) => {
    if (self.status === RESOLVED) {
      setTimeout(() => {
        try {
          let data = onResolved(self.value);
          processPromise(nextPromise, data, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (self.status === REJECTED) {
      setTimeout(() => {
        try {
          let data = onRejected(self.reason);
          processPromise(nextPromise, data, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (self.status === PENDING) {
      self.onResolvedCallBacks.push(() => {
        setTimeout(() => {
          try {
            let data = onResolved(self.value);
            processPromise(nextPromise, data, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      self.onRejectedCallBacks.push(() => {
        setTimeout(() => {
          try {
            let data = onRejected(self.reason);
            processPromise(nextPromise, data, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  });

  return nextPromise;
};

function processPromise(nextPromise, data, resolve, reject) {
  // console.log('processPromise', nextPromise, data);
  if (nextPromise === data) {
    reject(new TypeError('Chaining cycle detected for promise #<Promise>]'));
  }
  if ((typeof data === 'object' && data !== null) || typeof data === 'function') {
    let called = false;

    try {
      let then = data.then;
      if (typeof then === 'function') {
        then.call(
          data,
          (y) => {
            if (called) return;
            called = true;
            processPromise(nextPromise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(data);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(data);
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;
