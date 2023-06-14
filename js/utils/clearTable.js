export const clearTable = (tableBody) => {
  const stationNameElement = document.getElementById("station-name");

  while (tableBody.firstChild) {
    tableBody.firstChild.remove();
  }

  let stationName = document.querySelector('input[name="station"]:checked').value;;

  stationNameElement.textContent = stationName;
  return;
}
