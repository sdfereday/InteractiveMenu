window.addEventListener('load', function () {

  'use strict';

  function foreach(els, fn, ctx) {
    ctx = ctx ? ctx : this;
    for (let i = 0; i < els.length; i++) {
      fn.call(ctx, els[i], i);
    }
  }

  let prevSlide = null;
  let offset = -256; // TODO: Should be done via data-attrib

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
      el: menuElement,
      bg: menuElement.querySelector('.ltbg')
    };

    this.contentElement = heroElement.querySelector('.content');

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

    menuElement.addEventListener('click', function () {
      self.open();
    });

    this.adjustCenter();

  };

  ItemModel.prototype.hide = function () {

    this.heroElement.className = this.classes.hero;
    this.menuElement.el.className = this.classes.menu;

    this.regions.right.el.style.backgroundPosition = "";
    this.regions.left.el.style.backgroundPosition = "";
    this.menuElement.bg.style.backgroundPosition = "";

    this.state *= -1;

  };

  ItemModel.prototype.open = function () {

    this.state *= -1;
    this.heroElement.className = this.state < 0 ? this.classes.hero + ' active' : this.classes.hero;
    this.menuElement.el.className = this.state < 0 ? this.classes.menu + ' active' : this.classes.menu;

    let offsetPoint = (this.menuElement.x + this.regions.right.el.clientWidth) - this.container.clientWidth;
    //let offsetPointB = this.regions.center.width + (this.regions.left.el.clientWidth + (this.menuElement.x + this.regions.right.el.clientWidth)) - this.container.clientWidth;
    let offsetPointB = this.container.clientWidth;
    let offsetPointC = offsetPointB;

    if (this.state < 0) {

      //this.regions.right.el.style.backgroundPosition = (offsetPoint + offset) + "px 100%";
      //this.regions.left.el.style.backgroundPosition = (offsetPointB + offset) + "px 100%";
      // + this.regions.left.el.clientWidth

      // Use this to figure out the proper position on the left region
      let fakeWidth = this.menuElement.w + this.regions.right.el.clientWidth;

      //this.regions.left.el.style.backgroundPosition = -fakeWidth + "px 100%";

      // container width - this.regions.left.el.clientWidth

      // this.regions.left.el.style.backgroundPosition = (this.regions.left.el.clientWidth - (254)) + "px 100%";
      //((this.regions.left.el.clientWidth + offset) - (offsetPointB))

      this.regions.left.el.style.backgroundPosition = -this.container.clientWidth + "px 100%";
      this.regions.right.el.style.backgroundPosition = -(this.menuElement.w + -offset) + "px 100%";

      this.menuElement.bg.style.backgroundPosition = offset + "px 100%";

    } else {

      this.regions.right.el.style.backgroundPosition = "";
      this.regions.left.el.style.backgroundPosition = "";
      this.menuElement.bg.style.backgroundPosition = "";

    }

    if (prevSlide && prevSlide !== this) {
      prevSlide.hide();
    }

    prevSlide = this;

  };

  ItemModel.prototype.adjustCenter = function (w, h, x, y) {

    this.regions.left.el.style.width = (this.menuElement.x) + 'px';

    this.regions.center.el.style.width = this.regions.center.width + 'px';

    let n = this.container.clientWidth - (this.regions.left.el.clientWidth + this.regions.center.width);
    this.regions.right.el.style.width = n + 'px';

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

  items[0].open();

});