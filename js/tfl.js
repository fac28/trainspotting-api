const table = document.querySelector("table");
const inboundTable = document.querySelector("#inbound-table");
const outboundTable = document.querySelector("#outbound-table");


// create object of station names and their ids
const stationNames = {
  "Euston Station": "940GZZLUEUS",
  "Finsbury Park Station": "940GZZLUFPK",
  "Vauxhall Station": "940GZZLUVXL",
};

function getDepartureTimes(station = "Finsbury Park") {
  // retrieve station id from station name
  const station_id = stationNames[station];
  // query the tfl proxy we made
  const url = "https://tfl-irbcjbnqca-og.a.run.app/search";
  fetch(url + "?station_id=" + station_id)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response.status);
        throw new Error("Error retrieving departure times");
      }
    })
    .then((departures) => {
      // checking the data
      console.log('all', departures)

      // no information for both directions
      if (departures.length === 0) {

        handleNoInfo('inbound');
        handleNoInfo('outbound');
        return;
      }

      const currentTime = departures[0].timestamp;
      const stationName = departures[0].stationName;
      const currentTimeBST = new Date(currentTime).toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
      });
      console.log("Current Time:", currentTimeBST);
      console.log("Station Name:", stationName);

      retrieveDepartureTimes(departures);

      const departureInfoArray = JSON.parse(localStorage.getItem("myStorage"));

      const [northboundNew, southboundNew] = sortDepartures(departureInfoArray);

      populateTable(northboundNew, "outbound");
      populateTable(southboundNew, "inbound");
    })
    .catch((error) => {
      console.error(error);
    });
}

function retrieveDepartureTimes(departures) {
  /*
  given an object of departures, return an array of objects
  with the following properties:
  departureNumber, platform, destination, timeToStationMinutes,
  arriveIn, ArrivalTime, direction
  */

  const departureInfoArray = [];

  for (let i = 0; i < departures.length; i++) {
    const departure = departures[i];
    const platform = departure.platformName
      .replace("Northbound - Platform ", "")
      .replace("Southbound - Platform ", "");
    let destination = departure.destinationName.replace(
      "Underground Station",
      ""
    );
    const timeToStation = departure.timeToStation;
    const timeToStationMinutes = Math.floor(timeToStation / 60);
    const expectedArrival = departure.expectedArrival;
    // adjust for british summer time
    const adjustedArrival = new Date(expectedArrival).toLocaleTimeString(
      "en-GB",
      { timeZone: "Europe/London" }
    );
    let direction = departure.direction;
    const stationName = departure.stationName;

    // removing white space from destination and filling in missing direction
    if (destination === "Walthamstow Central ") {
      destination = "Walthamstow Central";
      direction = "outbound";
    }
    if (destination === "Brixton ") {
      destination = "Brixton";
      direction = "inbound";
    }

    let departureInfo = {
      departureNumber: i + 1,
      platform: platform,
      destination: destination,
      timeToStationMinutes: timeToStationMinutes,
      arriveIn: timeToStationMinutes + " mins",
      ArrivalTime: adjustedArrival,
      direction: direction,
      stationName: stationName,
    };

    departureInfoArray.push(departureInfo); // Append departureInfo object to the array
  }

  localStorage.setItem("myStorage", JSON.stringify(departureInfoArray));
}

function sortDepartures(departureInfoArray) {
  //sort departureInfoArray by timeToStationMinutes
  const sortedDepartures = departureInfoArray.sort(
    (a, b) => a.timeToStationMinutes - b.timeToStationMinutes
  );

  console.log("sorted departures", sortedDepartures);

  /* separate departureInfoArray by direction
  as two arrays: northboud and southbound
  */

  const northbound = sortedDepartures.filter(
    (departure) => departure.direction === "outbound"
  );
  const southbound = sortedDepartures.filter(
    (departure) => departure.direction === "inbound"
  );

  //keep maximum of 3 departures per direction
  const northboundNew = northbound.slice(0, 3);
  const southboundNew = southbound.slice(0, 3);
  return [northboundNew, southboundNew];
}

function populateTable(array, direction) {

  // define table body
  const currentTable = direction === "inbound" ? inboundTable : outboundTable;
  const tableBody = currentTable.querySelector("tbody");

  clearTable(tableBody);

  // function to loop through array and populate table accordingly
  for (const item of array) {
    const row = document.createElement("tr");
    for (const key in item) {
      if (
        !["direction", "departureNumber",
        "timeToStationMinutes", "stationName"].includes(key)
      ) {
        const cell = document.createElement("td");
        cell.textContent = item[key];
        row.appendChild(cell);
      }
    }
    tableBody.appendChild(row);
  }
  console.log(direction + " information added to table");
}

//retrieve user choice in the form selector
const form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const station = document.querySelector("#station").value;
  console.log("station: ", station);

  getDepartureTimes(station);
  return;
}

function clearTable(tableBody){
  const stationNameElement = document.getElementById("station-name");

  while (tableBody.firstChild) {
    tableBody.firstChild.remove();
  }

  let stationName = document.querySelector("#station").value;

  stationNameElement.textContent = stationName;
}

function handleNoInfo(direction){
  console.log("No departures for " + direction + " at this time");

  const currentTable = direction === "inbound" ? inboundTable : outboundTable;

  // remove thead
  const tableHead = currentTable.querySelector("thead");
  tableHead.remove();

  const tableBody = currentTable.querySelector("tbody");

  clearTable(tableBody);

  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.textContent = 'No departure info at this time';
  row.appendChild(cell);
  tableBody.appendChild(row);
  return;
}
