const stationId = '940GZZLUFPK'; // Finsbury Park station ID for Victoria Line
const appKey = "trustno1";

function getDepartureTimes() {
  const url = `https://api.tfl.gov.uk/Line/victoria/Arrivals/${stationId}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'app_key': appKey
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.log(response.status);
      throw new Error('Error retrieving departure times');
    }
  })
  .then(departures => {

    if (departures.length === 0) {
      const departureInfoArray = [];
      console.log('No departures')
      let departureInfo = {
        platform: 'Sorry, no train info available at the moment.'
      };

      departureInfoArray.push(departureInfo); // Append departureInfo object to the array
      localStorage.setItem('myStorage', JSON.stringify(departureInfoArray));
      return;}

    console.log(departures)
    // const currentTime = departures[0].timestamp;
    // const currentTimeBST = new Date(currentTime).toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });
    // console.log('Current Time:', currentTimeBST);

    retrieveDepartureTimes(departures)
  })
  .catch(error => {
    console.error(error);
  });
}
getDepartureTimes()

function retrieveDepartureTimes(departures) {

  const departureInfoArray = [];
    //write a for loop the get the next three departures
  const platform = departures[0].platformName;
  let num = departures.length;

  // only get the next 5 departures max
  if (num> 5) {
    num = 5;
  }

  for (let i = 0; i < num; i++) {
    const departure = departures[i];
    const destination = departure.destinationName;
    const timeToStation = departure.timeToStation;
    const timeToStationMinutes = Math.floor(timeToStation / 60);
    const expectedArrival = departure.expectedArrival;
    const adjustedArrival = new Date(expectedArrival).toLocaleTimeString('en-GB', { timeZone: 'Europe/London' })
    console.log(adjustedArrival)

    let departureInfo = {
      departureNumber: i + 1,
      platform: platform,
      destination: destination,
      timeToStationMinutes: timeToStationMinutes
    };

    departureInfoArray.push(departureInfo); // Append departureInfo object to the array
    localStorage.setItem('myStorage', JSON.stringify(departureInfoArray));
}}

const departureInfoArray = JSON.parse(localStorage.getItem('myStorage'));

console.log(departureInfoArray);

const table = document.querySelector('table');

if (departureInfoArray) {

for (const item of departureInfoArray) {
  const row = document.createElement('tr');
  for (const key in item) {
    const cell = document.createElement('td');
    cell.textContent = item[key];
    row.appendChild(cell);
  }
  table.appendChild(row);
}}
