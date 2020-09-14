function shallowCopy(data) {
  if (typeof data !== 'object') return data;
  var newData = data instanceof Array ? [] : {};
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      newData[key] = data[key];
    }
  }
  return newData;
}
