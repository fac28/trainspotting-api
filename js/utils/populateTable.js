import { inboundTable, outboundTable } from "../constants/constants.js";
import { clearTable } from "./clearTable.js";
import { handleNoInfo } from "./handleNoInfo.js";

export const populateTable = (array, direction) => {

  // if no array, handle no info
  if (array.length === 0) {
    handleNoInfo(direction);
    return;
  }
  // define table body
  const currentTable = direction === "inbound" ? inboundTable : outboundTable;
  // show tablehead
  const tableHead = currentTable.querySelector("thead");
  tableHead.style.display = "table-header-group";
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
