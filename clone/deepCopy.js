function deepCopy(data) {
  if (typeof data !== 'object') return data;
  var newData = Array.isArray(data) ? [] : {};
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      newData[key] = deepCopy(data[key]);
    }
  }
}
