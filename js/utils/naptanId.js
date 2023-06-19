// find naptanID from a given station

export const findObjectByKey = (array, value) => {
  for (var i = 0; i < array.length; i++) {
    if (array[i]["commonName"].toLowerCase().includes(value.toLowerCase())) {
      return array[i]["naptanID"];
    }
  }
  return null;
}
