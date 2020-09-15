function extend() {
  var target = arguments[0];
  var i = 1;
  var deep = false;
  // 第一个参数可以指定是否进行深度合并
  if (typeof arguments[0] === 'boolean') {
    if (arguments[0]) {
      deep = true;
    }
    // 目标对象，默认值为{}
    target = isObjectOrArray(arguments[1]) ? arguments[1] : {};
    i++;
  }

  for (; i < arguments.length; i++) {
    var option = arguments[i];
    // 只合并对象或者数组，其他忽略
    if (isObjectOrArray(option)) {
      for (key in option) {
        if (target === option[key]) {
          continue;
        }
        if (option.hasOwnProperty(key)) {
          if (deep) {
            // 类型不一致时，相当于浅合并
            if (toStringType(target[key]) !== toStringType(option[key])) {
              target[key] = option[key];
            } else {
              // 深度合并
              target[key] = extend(true, target[key], option[key]);
            }
          } else {
            // 浅合并
            target[key] = option[key];
          }
        }
      }
    }
  }
  return target;
}
function toStringType(obj) {
  return Object.prototype.toString.call(obj);
}

function isPlainObject(obj) {
  return toStringType(obj) === '[object Object]';
}

function isArray(obj) {
  return Array.isArray(obj);
}

function isObjectOrArray(obj) {
  return isPlainObject(obj) || Array.isArray(obj);
}
