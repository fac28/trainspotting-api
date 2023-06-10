const stationId = '940GZZLUFPK'; // Finsbury Park station ID for Victoria Line

const table = document.querySelector('table');
const inboundTable = document.querySelector('#inbound-table');
const outboundTable = document.querySelector('#outbound-table');

function getDepartureTimes() {
  // query the tfl proxy we made
  const url = 'https://tfl-irbcjbnqca-ew.a.run.app/search'
  fetch (url)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.log(response.status);
      throw new Error('Error retrieving departure times');
    }
  })
  .then(departures => {
    // display error message if no train found (not tested yet)
    if (departures.length === 0) {
      console.log('No departures')

      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = 'Sorry, no train info available at the moment.';
      row.appendChild(cell);
      table.appendChild(row);
      return;
    }

    const currentTime = departures[0].timestamp;
    const currentTimeBST = new Date(currentTime).toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });
    console.log('Current Time:', currentTimeBST);

    retrieveDepartureTimes(departures)
  })
  .catch(error => {
    console.error(error);
  });
}
getDepartureTimes()

function retrieveDepartureTimes(departures) {

  const departureInfoArray = [];

  // only get the next 5 departures max
  let num = departures.length;
  if (num > 5) {
    num = 5;
  }

  for (let i = 0; i < num; i++) {
    const departure = departures[i];
    const platform = departure.platformName
      .replace("Northbound - Platform ", '')
      .replace("Southbound - Platform ", '');
    const destination = departure.destinationName.replace("Underground Station", '');
    const timeToStation = departure.timeToStation;
    const timeToStationMinutes = Math.floor(timeToStation / 60);
    const expectedArrival = departure.expectedArrival;
    const adjustedArrival = new Date(expectedArrival).toLocaleTimeString('en-GB', { timeZone: 'Europe/London' })
    const direction = departure.direction;

    let departureInfo = {
      departureNumber: i + 1,
      platform: platform,
      destination: destination,
      timeToStationMinutes: timeToStationMinutes,
      arriveIn: timeToStationMinutes + ' mins',
      ArrivalTime: adjustedArrival,
      direction: direction
    };

    departureInfoArray.push(departureInfo); // Append departureInfo object to the array
    localStorage.setItem('myStorage', JSON.stringify(departureInfoArray));
}}

const departureInfoArray = JSON.parse(localStorage.getItem('myStorage'))
.sort(function(a, b) {
  console.log(a.timeToStationMinutes - b.timeToStationMinutes);
  return a.timeToStationMinutes - b.timeToStationMinutes;
});
console.log(departureInfoArray);


if (departureInfoArray) {

for (const item of departureInfoArray) {

  const row = document.createElement('tr');
  for (const key in item) {
    if (key!=='direction' && key!=='departureNumber' && key!=='timeToStationMinutes') {
    const cell = document.createElement('td');
    cell.textContent = item[key];
    row.appendChild(cell);
    }
  }

  if (item.direction === 'inbound') {
    inboundTable.appendChild(row);
  } else if (item.direction === 'outbound') {
    outboundTable.appendChild(row);
  }
}}
