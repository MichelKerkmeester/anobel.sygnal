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
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(this.lastScrollTop - currentScroll) <= 20)
          return;
        if (currentScroll > this.lastScrollTop && currentScroll > 30) {
          this.navbar.style.transform = "translateY(-200%)";
        } else {
          this.navbar.style.transform = "translateY(0)";
        }
        this.lastScrollTop = currentScroll;
      };
      this.init();
      document.addEventListener("sygnal:load", () => {
        this.init();
      });
      window.Webflow && window.Webflow.push(() => {
        this.init();
      });
    }
    init() {
      var _a;
      this.navbar = document.querySelector(
        ".navbar, .nav-bar, [data-animation='navbar']"
      );
      if (!this.navbar) {
        console.warn(
          "First attempt to find navbar failed, trying secondary selectors..."
        );
        this.navbar = document.querySelector("nav, .w-nav, .navigation");
      }
      if (!this.navbar) {
        console.error(
          "Navigation bar element not found! Available classes:",
          (_a = document.querySelector("nav")) == null ? void 0 : _a.classList
        );
        return;
      }
      this.navbar.style.transform = "translateY(0)";
      this.navbar.style.transition = "transform 0.15s ease";
      this.setupScrollListener();
    }
    setupScrollListener() {
      window.addEventListener("scroll", this.handleScroll, { passive: true });
    }
  };
})();
//# sourceMappingURL=hide-nav-on-scroll.js.map
