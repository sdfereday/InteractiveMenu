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

    let self = this;

    this.heroElement = heroElement;
    this.container = container;
    this.state = 1;

    this.classes = {
      hero: heroElement.className,
      menu: menuElement.className
    };

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

    menuElement.addEventListener('click', function(){
      self.open();
    });

    this.adjustCenter();

  };

  ItemModel.prototype.hide = function () {

    this.heroElement.className = this.classes.hero;
    this.menuElement.el.className = this.classes.menu;
    this.regions.right.el.style.backgroundPosition = "";
    this.state *= -1;

  };

  ItemModel.prototype.open = function() {

      this.state *= -1;
      this.heroElement.className = this.state < 0 ? this.classes.hero + ' active' : this.classes.hero;
      this.menuElement.el.className = this.state < 0 ? this.classes.menu + ' active' : this.classes.menu;

      if (this.state < 0) {
        this.regions.right.el.style.backgroundPosition = -(this.menuElement.w) + "px -57px";
      } else {
        this.regions.right.el.style.backgroundPosition = "";
      }

      if (prevSlide && prevSlide !== this) {
        prevSlide.hide();
      }

      prevSlide = this;

  };

  ItemModel.prototype.adjustCenter = function (w, h, x, y) {

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

  //items[0].open();

});