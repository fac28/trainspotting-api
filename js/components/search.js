const stations = [
  { id: "walthamstow-central", name: "Walthamstow Central Station"},
  { id: "blackhorse-road", name: "Blackhorse Road Station" },
  { id: "tottenham-hale", name: "Tottenham Hale Station" },
  { id: "seven-sisters", name: "Seven Sisters Station" },
  { id: "finsbury-park", name: "Finsbury Park Station" },
  { id: "highbury-islington", name: "Highbury & Islington Station" },
  { id: "kings-cross", name: "Kings Cross St. Pancras Station" },
  { id: "euston", name: "Euston Station"},
  { id: "warren-street", name: "Warren Street Station" },
  { id: "oxford-circus", name: "Oxford Circus Station" },
  { id: "green-park", name: "Green Park Station" },
  { id: "victoria", name: "Victoria Station" },
  { id: "pimlico", name: "Pimlico Station" },
  { id: "vauxhall", name: "Vauxhall Station" },
  { id: "stockwell", name: "Stockwell Station" },
  { id: "brixton", name: "Brixton Station" }
];

const searchInput = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results-container");

searchInput.addEventListener("input", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredStations = stations.filter(station => station.name.toLowerCase().includes(searchTerm));
  renderResults(filteredStations);
}

function renderResults(results) {
  resultsContainer.innerHTML = "";

  results.forEach(station => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.id = station.id;
    radioInput.name = "station";
    radioInput.value = station.name;
    if (station.checked) {
      radioInput.checked = true;
    }

    const radioLabel = document.createElement("label");
    radioLabel.setAttribute("for", station.id);

    const radioSpan = document.createElement("span");
    radioSpan.className = "radio-button";

    let stationName = station.name;

    stationName = stationName.replace(" Station", "");

    const labelText = document.createTextNode(stationName);
    radioLabel.appendChild(radioSpan);
    radioLabel.appendChild(labelText);

    resultItem.appendChild(radioInput);
    resultItem.appendChild(radioLabel);
    resultsContainer.appendChild(resultItem);
  });
}
