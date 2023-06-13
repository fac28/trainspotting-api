const table = document.querySelector("table");
const inboundTable = document.querySelector("#inbound-table");
const outboundTable = document.querySelector("#outbound-table");
const form = document.querySelector("form");

form.addEventListener("submit", handleSubmit);

// object of station names and their ids
const stationNames = {
  "Euston Station": "940GZZLUEUS",
  "Finsbury Park Station": "940GZZLUFPK",
  "Vauxhall Station": "940GZZLUVXL",
  "Green Park Station": "940GZZLUGPK"
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
      console.log('all', departures)

      /*
      display error info for both directions
      when there's no departure info
      */

      if (departures.length === 0) {
        handleNoInfo('inbound');
        handleNoInfo('outbound');
        return;
      }

      // display current time in BST
      const currentTime = departures[0].timestamp;
      const currentTimeBST = new Date(currentTime).toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
      });
      console.log("Current Time:", currentTimeBST);

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
  given an object of departures info,
  return an array of objects with the following properties:

  - platform,
  - destination,
  - timeToStationMinutes,
  - arriveIn (string),
  - ArrivalTime,
  - direction
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
    let adjustedArrival = new Date(expectedArrival).toLocaleTimeString(
      "en-GB",
      { timeZone: "Europe/London" }
    );
    // only keep the hour and minute
    adjustedArrival= adjustedArrival.slice(0, -3);
    let direction = departure.direction;
    const stationName = departure.stationName;

    // removing white space from destination and filling in missing direction
    if (destination === "Walthamstow Central ") {
      destination = "Walthamstow";
      direction = "outbound";
    } else if (destination === "Brixton ") {
      destination = "Brixton";
      direction = "inbound";
    }

    let departureInfo = {
      platform: platform,
      destination: destination,
      timeToStationMinutes: timeToStationMinutes,
      ArrivalTime: adjustedArrival,
      arriveIn: timeToStationMinutes + " mins",
      direction: direction,
      stationName: stationName,
    };

    // Append departureInfo object to the array
    departureInfoArray.push(departureInfo);
  }

  localStorage.setItem("myStorage", JSON.stringify(departureInfoArray));
}

function sortDepartures(departureInfoArray) {
  //sort departureInfoArray by timeToStationMinutes
  const sortedDepartures = departureInfoArray.sort(
    (a, b) => a.timeToStationMinutes - b.timeToStationMinutes
  );

  console.log("sorted departures", sortedDepartures);

  // separate departureInfoArray by direction
  const northbound = sortedDepartures.filter(
    (departure) => departure.direction === "outbound"
  );
  const southbound = sortedDepartures.filter(
    (departure) => departure.direction === "inbound"
  );

  // if either array is empty, apply handleNoInfo to display error message
  if (northbound.length === 0) {
    handleNoInfo("outbound");
  } else if (southbound.length === 0) {
    handleNoInfo("inbound");
  }

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
        !["direction", "timeToStationMinutes", "stationName"].includes(key)
      ) {
        const cell = document.createElement("td");

        if (key === "ArrivalTime") {
          // Hide the cell for smaller screens
          cell.classList.add("hide-on-small-screen");
        }
        cell.textContent = item[key]
        row.appendChild(cell);
      }
    }
    tableBody.appendChild(row);
  }
  console.log(direction + " information added to table");
}

function handleSubmit(event) {
  event.preventDefault();
  const station = document.querySelector('input[name="station"]:checked').value;

  console.log("user selected: ", station);

  getDepartureTimes(station);
  return;
}

function clearTable(tableBody) {
  const stationNameElement = document.getElementById("station-name");

  while (tableBody.firstChild) {
    tableBody.firstChild.remove();
  }

  let stationName = document.querySelector('input[name="station"]:checked').value;;

  stationNameElement.textContent = stationName;
}

function handleNoInfo(direction) {
  console.log("No departures for " + direction + " at this time");

  const currentTable = direction === "inbound" ? inboundTable : outboundTable;

  // remove thead and tbody
  const tableHead = currentTable.querySelector("thead");
  const tableBody = currentTable.querySelector("tbody");
  tableHead.remove();
  clearTable(tableBody);

  // add error message
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.textContent = 'No departure info at this time';
  row.appendChild(cell);
  tableBody.appendChild(row);
  return;
}
