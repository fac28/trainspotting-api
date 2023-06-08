require('dotenv').config()

const stationId = '940GZZLUFPK'; // Finsbury Park station ID for Victoria Line
const appKey = process.env.API_KEY; // Retrieve the API key from the environment variable

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
      //write a for loop the get the next three departures
      const platform = departures[0].platformName;
      const currentTime = departures[0].timestamp;
      const currentTimeBST = new Date(currentTime).toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });

      console.log('Current Time:', currentTimeBST);

      for (let i = 0; i < 3; i++) {
        const departure = departures[i];
        const destination = departure.destinationName;
        const timeToStation = departure.timeToStation;
        const timeToStationMinutes = Math.floor(timeToStation / 60);

        console.log('Departure', i + 1);
        console.log('Platform:', platform);
        console.log('Destination:', destination);
        console.log('Time to Station (minutes):', timeToStationMinutes);
        console.log('--------------------------');
      }
    })
    .catch(error => {
      console.error(error);
    });
}

getDepartureTimes();
