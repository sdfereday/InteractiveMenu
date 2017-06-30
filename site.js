let hero = document.querySelector('.hero');
let link = document.querySelector('.activate');
let state = 1;

link.addEventListener('click', function() {

  state *= -1;

  hero.className = state < 0 ? 'hero active' : 'hero';
  link.className = state < 0 ? 'activate active' : 'activate';

});
