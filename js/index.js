const html = document.documentElement;
const htmlStyle = window.getComputedStyle(html);
const backgroundImage = htmlStyle.getPropertyValue('background-image');

console.log({backgroundImage})
