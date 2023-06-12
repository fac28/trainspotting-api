
const flickr_search_term = "train"

const flickr_url = "https://api.flickr.com/services/rest/?api_key=0fa41c7f9709b1d850756011e09bbef6&format=json&sort=interestingness-desc&method=flickr.photos.search&tags="
+ flickr_search_term + "&format=json&nojsoncallback=1"

// fetch from flickr_url using async
async function getFlickrPhotos() {
  const response = await fetch(flickr_url);
  const data = await response.json();

  // generate random index 1 to 100
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  const photo = data.photos.photo[randomNumber];
  const img_url = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_z.jpg";
  console.log(img_url);
  return img_url;
}

// add photos to the train page
function addPhotos(img_url) {
    const photo_div = document.getElementById("photos");

    const img = document.createElement("img");
    img.src = img_url;
    photo_div.appendChild(img);

}

(async function() {
  const url = await getFlickrPhotos();
  addPhotos(url);
})();
