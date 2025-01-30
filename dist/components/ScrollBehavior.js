"use strict";
(() => {
  // src/components/ScrollBehavior.ts
  var ScrollBehavior = class {
    constructor() {
      this.lastScrollTop = 0;
      this.navbar = null;
      this.scrollThreshold = 50;
      this.mobileBreakpoint = 768;
    }
    init() {
      this.navbar = document.querySelector(".nav--bar");
      if (!this.navbar) {
        console.error("Navbar element (.nav--bar) not found!");
        return;
      }
      this.navbar.style.transition = "transform 0.3s ease-in-out";
      window.addEventListener("scroll", this.handleScroll.bind(this), {
        passive: true
      });
    }
    handleScroll() {
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
    }
  };
})();
//# sourceMappingURL=ScrollBehavior.js.map
