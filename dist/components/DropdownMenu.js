"use strict";
(() => {
  // src/components/DropdownMenu.ts
  var DropdownMenu = class {
    constructor() {
      this.dropdowns = [];
      this.navigation = null;
      this.dropdownData = [];
    }
    init() {
      this.dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));
      if (!this.dropdowns.length) {
        console.error("No dropdown elements found in the DOM!");
        return;
      }
      this.navigation = document.querySelector(".nav--bar");
      if (!this.navigation) {
        console.error("Navigation container (.nav--bar) not found!");
        return;
      }
      this.dropdownData = this.dropdowns.map((dropdown) => {
        const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
        const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
        const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");
        if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
          console.warn(
            "Some required elements are missing in a .nav--dropdown!"
          );
          return null;
        }
        return {
          dropdown,
          toggle: dropdownToggle,
          dropdownMenu,
          icon: dropdownIcon,
          isOpen: false,
          animating: false
        };
      }).filter((d) => d !== null);
      this.dropdownData.forEach((d) => {
        if (!d)
          return;
        d.toggle.addEventListener("click", () => {
          if (d.animating)
            return;
          if (d.isOpen) {
            this.closeDropdown(d);
          } else {
            this.closeAllDropdowns(d);
            this.openDropdown(d);
          }
        });
      });
      document.addEventListener("click", this.handleDocumentClick.bind(this));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeAllDropdowns();
        }
      });
    }
    createOpenTimeline(d) {
      const tl = gsap.timeline({
        onStart: () => {
          d.animating = true;
        },
        onComplete: () => {
          d.animating = false;
        }
      });
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      tl.fromTo(
        d.dropdownMenu,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
      ).to(d.icon, { rotation: 180, duration: 0.3, ease: "power2.out" }, "<").to(
        d.toggle,
        { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
        "<"
      );
      if (isDesktop) {
        tl.to(
          this.navigation,
          {
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
            duration: 0.3,
            ease: "power2.out"
          },
          "<"
        );
      }
      return tl;
    }
    createCloseTimeline(d) {
      const tl = gsap.timeline({
        onStart: () => {
          d.animating = true;
        },
        onComplete: () => {
          d.animating = false;
        }
      });
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      tl.fromTo(
        d.dropdownMenu,
        { opacity: 1, height: d.dropdownMenu.scrollHeight },
        { opacity: 0, height: 0, duration: 0.3, ease: "power2.in" }
      ).to(d.icon, { rotation: 0, duration: 0.3, ease: "power2.in" }, "<").to(d.toggle, { backgroundColor: "", duration: 0.3 }, "<");
      if (isDesktop) {
        tl.to(
          this.navigation,
          {
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
            duration: 0.3,
            ease: "power2.in"
          },
          "<"
        );
      }
      return tl;
    }
    closeAllDropdowns(except = null) {
      this.dropdownData.forEach((d) => {
        if (d !== except && d.isOpen && !d.animating) {
          this.closeDropdown(d);
        }
      });
    }
    openDropdown(d) {
      this.createOpenTimeline(d).play();
      d.isOpen = true;
    }
    closeDropdown(d) {
      this.createCloseTimeline(d).play();
      d.isOpen = false;
    }
    handleDocumentClick(e) {
      this.dropdownData.forEach((d) => {
        if (d.isOpen && !d.animating) {
          const clickedInside = d.dropdown.contains(e.target) || d.toggle.contains(e.target);
          if (!clickedInside) {
            this.closeDropdown(d);
          }
        }
      });
    }
  };
})();
//# sourceMappingURL=DropdownMenu.js.map
