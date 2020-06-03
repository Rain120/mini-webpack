import name from './name.js';

const welcome = `Hello everyone, I'm ${name}`;

console.log(welcome);

document.querySelector('.root').innerHTML = welcome;
