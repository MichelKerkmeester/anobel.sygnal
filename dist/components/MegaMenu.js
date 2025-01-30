"use strict";
(() => {
  // src/components/MegaMenu.ts
  var MegaMenu = class {
    constructor() {
      this.megaMenu = null;
      this.menuButton = null;
      this.lottieAnimation = null;
      this.isOpen = false;
    }
    init() {
      this.megaMenu = document.querySelector(".nav--mega-menu");
      this.menuButton = document.querySelector(".btn--hamburger");
      if (!this.megaMenu || !this.menuButton) {
        console.error("Mega menu elements not found!");
        return;
      }
      this.lottieAnimation = lottie.loadAnimation({
        container: document.querySelector(".lottie--hamburger"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6777ecd6636dc4314d954783_Icon%20-%20Hamburger%20Menu.json"
      });
      this.menuButton.addEventListener("click", this.toggleMenu.bind(this));
    }
    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
      this.isOpen = !this.isOpen;
    }
    openMenu() {
      if (!this.megaMenu)
        return;
      this.megaMenu.style.display = "flex";
      gsap.to(this.megaMenu, {
        duration: 0.8,
        height: "100svh",
        width: "100%",
        ease: "power2.out",
        delay: 0.2,
        onComplete: () => {
          this.megaMenu.style.borderRadius = "0rem";
        }
      });
      this.lottieAnimation.playSegments([0, 70], true);
    }
    closeMenu() {
      if (!this.megaMenu)
        return;
      this.megaMenu.style.borderRadius = "1rem";
      gsap.to(this.megaMenu, {
        duration: 0.4,
        height: "0svh",
        width: "100%",
        ease: "power2.in",
        onComplete: () => {
          this.megaMenu.style.display = "none";
        }
      });
      this.lottieAnimation.removeEventListener("complete");
      this.lottieAnimation.playSegments([70, 140], true);
      this.lottieAnimation.addEventListener("complete", () => {
        this.lottieAnimation.goToAndStop(0, true);
        this.lottieAnimation.removeEventListener("complete");
      });
    }
  };
})();
//# sourceMappingURL=MegaMenu.js.map
