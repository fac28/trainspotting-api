const table = document.querySelector("table");
const inboundTable = document.querySelector("#inbound-table");
const outboundTable = document.querySelector("#outbound-table");

function getDepartureTimes() {
  // query the tfl proxy we made
  const url = "https://tfl-irbcjbnqca-ew.a.run.app/search";
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response.status);
        throw new Error("Error retrieving departure times");
      }
    })
    .then((allDepartures) => {
      // only keep departures from Finsbury Park
      const departures = allDepartures.filter((departure) =>
        departure.stationName.includes("Finsbury Park")
      );

      // display error message if no train found (not tested yet)
      if (departures.length === 0) {
        console.log("No departures");

        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = "Sorry, no train info available at the moment.";
        row.appendChild(cell);
        table.appendChild(row);
        return;
      }

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
    };

    departureInfoArray.push(departureInfo); // Append departureInfo object to the array
    localStorage.setItem("myStorage", JSON.stringify(departureInfoArray));
  }
}

function sortDepartures(departureInfoArray) {
  //sort departureInfoArray by timeToStationMinutes
  const sortedDepartures = departureInfoArray.sort(
    (a, b) => a.timeToStationMinutes - b.timeToStationMinutes
  );

  console.log("sorted departures", sortedDepartures);

  /* separate departureInfoArray by direction, as two arrays
  and another one for no direction */

  const northbound = sortedDepartures.filter(
    (departure) => departure.direction === "outbound"
  );
  const southbound = sortedDepartures.filter(
    (departure) => departure.direction === "inbound"
  );
  const noDirection = sortedDepartures.filter(
    (departure) => departure.direction === ""
  );

  // only keep the first instance of the same timeToStationMinutes
  removeDuplicates(northbound);
  removeDuplicates(southbound);

  //keep maximum of 3 departures per direction
  const northboundNew = northbound.slice(0, 3);
  const southboundNew = southbound.slice(0, 3);
  return [northboundNew, southboundNew];
}

function removeDuplicates(array) {
  // remove duplicate departures with the same timeToStationMinutes and platform
  for (let i = 0; i < array.length - 1; i++) {
    const departure = array[i];
    const timeToStation = departure.timeToStationMinutes;
    const nextDeparture = array[i + 1];
    const nextTimeToStation = nextDeparture.timeToStationMinutes;
    const platform = departure.platform;
    if (
      timeToStation === nextTimeToStation &&
      platform === nextDeparture.platform
    ) {
      array.splice(i + 1, 1);
      i--; // Adjust the index to revisit the current position
    }
  }
}

function populateTable(array, direction) {
  // function to loop through array and populate table accordingly
  for (const item of array) {
    const row = document.createElement("tr");
    for (const key in item) {
      if (
        !["direction", "departureNumber", "timeToStationMinutes"].includes(key)
      ) {
        const cell = document.createElement("td");
        cell.textContent = item[key];
        row.appendChild(cell);
      }
    }

    if (direction === "inbound") {
      inboundTable.appendChild(row);
    }
    if (direction === "outbound") {
      outboundTable.appendChild(row);
    }

    console.log(direction + " information added to table");
  }
}

getDepartureTimes();
