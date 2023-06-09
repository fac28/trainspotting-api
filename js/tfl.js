const stationId = '940GZZLUFPK'; // Finsbury Park station ID for Victoria Line
const appKey = String(API_KEY_PLACEHOLDER);

const inboundTable = document.querySelector('#inbound-table');
const outboundTable = document.querySelector('#outbound-table');

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
      if (response.status==429){
        console.log('API keys wrong');
        throw new Error('API keys wrong');
      }
      console.log(response.status);
      throw new Error('Error retrieving departure times');
    }
  })
  .then(departures => {
    console.log(departures)
    if (departures.length === 0) {
      const departureInfoArray = [];
      console.log('No departures')
      let departureInfo = {
        platform: 'Sorry, no train info available at the moment.'
      };

      departureInfoArray.push(departureInfo); // Append departureInfo object to the array
      localStorage.setItem('myStorage', JSON.stringify(departureInfoArray));
      return;}

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
    //write a for loop the get the next three departures
  let num = departures.length;

  // only get the next 5 departures max
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
      timeToStationMinutes: timeToStationMinutes + ' mins',
      ArrivalTime: adjustedArrival,
      direction: direction
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
    if (key!=='direction' && key!=='departureNumber') {
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
