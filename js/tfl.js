import { naptanObject, form, tflProxy } from "./constants/constants.js";
import { retrieveObject } from "./utils/retrieveObject.js";
import { sortDepartures } from "./utils/sortDepartures.js";
import { populateTable } from "./utils/populateTable.js";
import { handleNoInfo } from "./utils/handleNoInfo.js";
import { findObjectByKey } from "./utils/naptanId.js";

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  // if no selection made, pop up an alert asking user to select a station
  if (!document.querySelector('input[name="station"]:checked')) {
    alert("Please search for and select a station");
    return;
  }

  const station = document.querySelector('input[name="station"]:checked').value;

  console.log("user selected: ", station);

  // keep only the first word of the station name
  let stationShort = station.split(" ")[0];

  getDepartureTimes(stationShort);
  return;
}

function getDepartureTimes(station) {
  // retrieve station id from station name
  // const station_id = stationNames[station];
  const station_id = findObjectByKey(naptanObject, station);
  console.log("station id: ", station_id);
  // query the tfl proxy we made
  const url = tflProxy;
  fetch(url + "/" + station_id)
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

      // check if timestamp is available

      if (departures[0].timestamp === undefined) {
        console.log("Error retrieving timestamp");
        handleNoInfo("outbound");
        handleNoInfo("outbound");
        console.log(departures[0]);
        return;
      }


      const currentTime = departures[0].timestamp;
      const currentTimeBST = new Date(currentTime).toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
      });
      console.log("Current Time:", currentTimeBST);

      retrieveObject(departures);

      const departureInfoArray = JSON.parse(localStorage.getItem("myStorage"));

      const [northboundNew, southboundNew] = sortDepartures(departureInfoArray);

      console.log([northboundNew, southboundNew])
      // ignore southbound for Brixton and northbound for Walthamstow
      if (station.toLowerCase().includes("brixton")) {
        populateTable(northboundNew, "outbound");
        return;
      } else if (station.toLowerCase().includes("walthamstow")) {
        populateTable(northboundNew, "inbound");
        handleNoInfo("outbound");
        return;
      } else {
        populateTable(northboundNew, "outbound");
        populateTable(southboundNew, "inbound");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
