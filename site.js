window.addEventListener('load', function () {

  'use strict';

  function foreach(els, fn, ctx) {
    ctx = ctx ? ctx : this;
    for (let i = 0; i < els.length; i++) {
      fn.call(ctx, els[i], i);
    }
  }

  let prevSlide = null;

  let ItemModel = function (heroElement, menuElement, container) {

    this.heroElement = heroElement;
    this.container = container;

    this.menuElement = {
      x: menuElement.offsetLeft,
      w: menuElement.clientWidth,
      el: menuElement
    };

    if (this.menuElement.x < 0)
      this.menuElement.x = 0;

    this.regions = {
      left: {
        el: heroElement.querySelector('.left-region')
      },
      center: {
        width: this.menuElement.w,
        el: heroElement.querySelector('.center-region')
      },
      right: {
        el: heroElement.querySelector('.right-region')
      }
    };

    this.AdjustCenter(); // .. . .
    this.state = 1;
    let self = this;

    menuElement.addEventListener('click', function () {

      self.state *= -1;
      heroElement.className = self.state < 0 ? 'hero hero-item active' : 'hero hero-item';
      this.className = self.state < 0 ? 'activate active' : 'activate';

      if (self.state < 0) {
        self.regions.right.el.style.backgroundPosition = -(self.menuElement.w) + "px -57px";
      } else {
        self.regions.right.el.style.backgroundPosition = "";
      }

      if (prevSlide && prevSlide !== self) {
        prevSlide.hide();
      }

      prevSlide = self;

    });

  };

  ItemModel.prototype.hide = function () {

    this.heroElement.className = 'hero hero-item';
    this.menuElement.el.className = 'activate';
    this.state *= -1;
    this.regions.right.el.style.backgroundPosition = "";

  };

  ItemModel.prototype.AdjustCenter = function (w, h, x, y) {

    this.regions.left.el.style.width = (this.menuElement.x - this.regions.center.width) + 'px';

    this.regions.center.el.style.width = this.regions.center.width + 'px';

    this.regions.right.el.style.width = (this.container.clientWidth - (this.menuElement.x + this.menuElement.w)) + 'px';
    this.regions.right.el.style.marginLeft = (this.menuElement.x + this.regions.center.width) + 'px';

  };

  let heroItems = document.querySelectorAll('.hero-item');
  let menuItems = document.querySelectorAll('.menu-item');

  let items = [];

  if (heroItems.length !== menuItems.length)
    throw "Mismatch length.";

  // Order matters
  foreach(heroItems, function (el, i) {

    items.push(new ItemModel(el, menuItems[i], document.querySelector('.container')));

  });

});