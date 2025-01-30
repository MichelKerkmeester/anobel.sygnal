"use strict";
(() => {
  // src/components/LanguageSelector.ts
  var LanguageSelector = class {
    constructor() {
      this.languageBtn = null;
      this.languageDropdown = null;
      this.languageIcon = null;
    }
    init() {
      this.languageBtn = document.querySelector('[class*="language--btn-w"]');
      this.languageDropdown = document.querySelector(
        '[class*="language--dropdown-w"]'
      );
      this.languageIcon = document.querySelector(".icon--svg.is--language");
      if (!this.languageBtn || !this.languageDropdown || !this.languageIcon) {
        console.error("Required elements not found!");
        return;
      }
      this.languageBtn.addEventListener(
        "mouseenter",
        this.handleMouseEnter.bind(this)
      );
      this.languageBtn.addEventListener(
        "mouseleave",
        this.handleMouseLeave.bind(this)
      );
      this.languageBtn.addEventListener("click", this.handleClick.bind(this));
      document.addEventListener("click", this.handleDocumentClick.bind(this));
    }
    toggleDropdown(isOpen) {
      gsap.to(this.languageIcon, {
        rotation: isOpen ? 180 : 0,
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(this.languageBtn, {
        backgroundColor: isOpen ? "var(--secondary--darkest)" : "var(--secondary--darker)",
        duration: 0.3
      });
      if (isOpen) {
        gsap.set(this.languageDropdown, {
          visibility: "visible",
          height: 0,
          opacity: 0
        });
        gsap.to(this.languageDropdown, {
          opacity: 1,
          height: "auto",
          duration: 0.5,
          ease: "power3.out"
        });
      } else {
        gsap.to(this.languageDropdown, {
          opacity: 0,
          height: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(this.languageDropdown, { visibility: "hidden" });
          }
        });
      }
    }
    handleMouseEnter() {
      if (!this.languageBtn.classList.contains("clicked")) {
        gsap.to(this.languageBtn, {
          width: "4.75rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
    handleMouseLeave() {
      if (!this.languageBtn.classList.contains("clicked")) {
        gsap.to(this.languageBtn, {
          width: "2rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
    handleClick() {
      const isClicked = this.languageBtn.classList.toggle("clicked");
      this.toggleDropdown(isClicked);
    }
    handleDocumentClick(event) {
      const target = event.target;
      if (!target)
        return;
      const isInside = this.languageBtn.contains(target) || this.languageDropdown.contains(target);
      const isDropdownTrigger = target.closest(
        ".btn--nav-dropdown"
      );
      if (!isInside && this.languageBtn.classList.contains("clicked") || isDropdownTrigger && !this.languageDropdown.contains(isDropdownTrigger)) {
        this.languageBtn.classList.remove("clicked");
        this.toggleDropdown(false);
        gsap.to(this.languageBtn, {
          width: "2rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  };
})();
//# sourceMappingURL=LanguageSelector.js.map
