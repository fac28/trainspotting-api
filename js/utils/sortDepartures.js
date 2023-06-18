import { handleNoInfo } from "./handleNoInfo.js";

export const sortDepartures = (departureInfoArray) => {
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
  }

  if (southbound.length === 0) {
    handleNoInfo("inbound");
  }

  //keep maximum of 3 departures per direction
  const northboundNew = northbound.slice(0, 3);
  const southboundNew = southbound.slice(0, 3);

  return [northboundNew, southboundNew];
}
