window.addEventListener('load', function () {

  'use strict';

  function foreach(els, fn, ctx) {
    ctx = ctx ? ctx : this;
    for (let i = 0; i < els.length; i++) {
      fn.call(ctx, els[i], i);
    }
  }

  let prevSlide = null,
  items = [],
  heroItems = document.querySelectorAll('.hero-item'),
  menuItems = document.querySelectorAll('.menu-item');

  let ItemModel = function (heroElement, menuElement, container) {
   
    this.heroElement = heroElement;
    this.container = container;
    this.state = 1;
    this.offset = parseInt(heroElement.getAttribute('data-bgoffset')) || 0;

    this.classes = {
      hero: heroElement.className,
      menu: menuElement.className
    };

    this.menuElement = {
      x: menuElement.offsetLeft,
      w: menuElement.clientWidth,
      el: menuElement,
      bg: menuElement.querySelector('.ltbg')
    };

    this.contentElement = heroElement.querySelector('.content');

    if (this.menuElement.x < 0)
      this.menuElement.x = 0;

    this.regions = {
      left: {
        el: heroElement.querySelector('.left-region'),
        bg: heroElement.querySelector('.left-region').querySelector('.bg')
      },
      center: {
        width: this.menuElement.w,
        el: heroElement.querySelector('.center-region')
      },
      right: {
        el: heroElement.querySelector('.right-region'),
        bg: heroElement.querySelector('.right-region').querySelector('.bg')
      }
    };

    let self = this;
    menuElement.addEventListener('click', function () {
      self.open();
    });

    this.adjustCenter();

  };

  ItemModel.prototype.clear = function () {

    this.regions.right.bg.style.backgroundPosition = "";
    this.regions.left.bg.style.backgroundPosition = "";
    this.menuElement.bg.style.backgroundPosition = "";

  };

  ItemModel.prototype.reposition = function () {

    this.regions.left.bg.style.backgroundPosition = (this.menuElement.w + this.offset) + "px 100%";
    this.regions.right.bg.style.backgroundPosition = -(this.menuElement.w + -this.offset) + "px 100%";
    this.menuElement.bg.style.backgroundPosition = this.offset + "px 100%";

  };

  ItemModel.prototype.hide = function () {

    this.heroElement.className = this.classes.hero;
    this.menuElement.el.className = this.classes.menu;

    this.clear();

    this.state *= -1;

  };

  ItemModel.prototype.open = function () {

    this.state *= -1;
    this.heroElement.className = this.state < 0 ? this.classes.hero + ' active' : this.classes.hero;
    this.menuElement.el.className = this.state < 0 ? this.classes.menu + ' active' : this.classes.menu;

    if (this.state < 0) {
      this.reposition();
    } else {
      this.clear();
    }

    if (prevSlide && prevSlide !== this)
      prevSlide.hide();

    prevSlide = this;

  };

  ItemModel.prototype.adjustCenter = function (w, h, x, y) {

    this.regions.left.el.style.width = (this.menuElement.x) + 'px';
    this.regions.center.el.style.width = this.regions.center.width + 'px';

    let n = this.container.clientWidth - (this.regions.left.el.clientWidth + this.regions.center.width);
    this.regions.right.el.style.width = n + 'px';

  };

  if (heroItems.length !== menuItems.length)
    throw "Mismatch length.";

  foreach(heroItems, function (el, i) {

    items.push(new ItemModel(el, menuItems[i], document.querySelector('.container')));

  });

  items[0].open();

});