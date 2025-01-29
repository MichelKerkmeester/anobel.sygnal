"use strict";
(() => {
  // src/components/--NAVIGATION/hide-nav-on-scroll.ts
  var HideNav = class {
    constructor() {
      this.lastScrollTop = 0;
      this.navbar = null;
      this.scrollThreshold = 50;
      this.mobileBreakpoint = 768;
      this.handleScroll = () => {
        if (!this.navbar)
          return;
        if (window.innerWidth <= this.mobileBreakpoint)
          return;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(this.lastScrollTop - currentScroll) <= this.scrollThreshold)
          return;
        if (currentScroll > this.lastScrollTop && currentScroll > 50) {
          this.navbar.style.transform = "translateY(-200%)";
        } else {
          this.navbar.style.transform = "translateY(0)";
        }
        this.lastScrollTop = currentScroll;
      };
      document.addEventListener("DOMContentLoaded", () => this.init());
    }
    init() {
      this.navbar = document.querySelector(".nav--bar");
      if (!this.navbar) {
        console.error("Navigation bar element not found!");
        return;
      }
      this.navbar.style.transition = "transform 0.3s ease-in-out";
      this.setupScrollListener();
    }
    setupScrollListener() {
      window.addEventListener("scroll", this.handleScroll, { passive: true });
    }
  };
})();
//# sourceMappingURL=hide-nav-on-scroll.js.map
