export const retrieveObject = (departures) =>{
  /*
  given an object of departures info,
  return an array of objects with the following properties:

  - platform,
  - destination,
  - timeToStationMinutes,
  - arriveIn (string),
  - ArrivalTime,
  - direction,
  - stationName
  */

  const departureInfoArray = [];

  for (let i = 0; i < departures.length; i++) {
    const departure = departures[i];
    const platform = departure.platformName
      .replace("Northbound - Platform ", "")
      .replace("Southbound - Platform ", "");
    let destination = departure.destinationName;
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
    let formattedDestination = destination
    .replace(
      "Underground Station",
      ""
    )
    .replace("Central","")
    .trim();

    // handle the two end stations; force destination to the opposite end station
    if (stationName.includes("Walthamstow") && formattedDestination.includes("Walthamstow")) {
      direction = "outbound";
      formattedDestination = "Brixton";
    } else if (stationName.includes("Brixton") && formattedDestination.includes("Brixton")) {
      direction = "outbound";
      formattedDestination = "Walthamstow";
    }

    let departureInfo = {
      platform: platform,
      destination: formattedDestination,
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
