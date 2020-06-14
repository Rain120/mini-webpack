import name from './name.js';

const welcome = `Hello everyone, I'm ${name}`;

console.log(Date.now(), welcome);

document.querySelector('.root').innerHTML = welcome;
