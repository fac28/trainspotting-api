const body = document.querySelector('.body');
const author = document.querySelector('.background-pic__author')

const getImage = async () => {
    const response = await fetch('https://picsum.photos/id/348/info');
    const data = await response.json();
    return data;
}

const init = async () => {
    try {
        const result = await getImage();
        body.style.backgroundImage = `url(${result.download_url})`;
        author.textContent = `${result.author}`
    } catch(error) {
        console.error(error);
    }
}

init();
