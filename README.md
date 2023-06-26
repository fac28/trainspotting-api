# Train Spotting

See the Beauty, Catch the Ride!

A sleek display that brings you stunning visuals and live departure times for all Victoria Line stations.

## User Journey

Start from our landing page, and go checkout the latest departure time when you're ready.


## Run Locally

### Clone the project

#### Option 1: if you have [GitHub CLI installed](https://github.com/cli/cli/tree/trunk)

```bash
  gh repo clone fac28/trainspotting-api
```

#### Option 2:

```bash
  git clone https://github.com/fac28/trainspotting-api.git
```

### Go to the project directory

```bash
  cd trainspotting-api
```

and open the folder in vscode

### Open the index.html file with Live Server in Visual Studio Code (VSCode)

#### Install the Live Server extension in VSCode.

If you haven't already installed it, you can do so by following these steps:

- Launch VSCode.
- Go to the Extensions view.
- Search for "Live Server" in the Extensions search bar and click the "Install" button.

#### In VSCode 
- Locate your index.html file. It should be visible in the sidebar on the left-hand side.
- Right-click on the index.html file and select "Open with Live Server" from the context menu. 

Live Server will open a new browser tab or window and load your index.html file. 

You can now see our webpage in action.


## Deployment

View our site on [GitHub Pages](https://fac28.github.io/trainspotting-api/)

## Tech Stack

HTML, CSS, JavaScript

Fast API, Docker, Google Cloud Platform
- Access the [TfL API proxy](https://tfl-api-proxy-v2-irbcjbnqca-ew.a.run.app/docs) we built


## Acknowledgements

APIs we used:

- [Unsplash It](https://picsum.photos/): Generates random images

- [TfL API](https://api-portal.tfl.gov.uk/): Everything you need to know about transport in London

Data:

- NaPTAN ID list from [ZackaryH8/tube-naptan](https://github.com/ZackaryH8/tube-naptan)
