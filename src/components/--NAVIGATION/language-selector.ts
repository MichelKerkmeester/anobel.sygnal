// Navigation
// Language Selector

import gsap from "gsap";

export class LanguageSelector {
  // Button element that triggers the language dropdown menu
  private languageBtn!: HTMLElement | null = null;

  // Container element that holds all language options
  private languageDropdown!: HTMLElement | null = null;

  // SVG icon element that rotates when dropdown is opened/closed
  private languageIcon!: SVGElement | null = null;

  constructor() {
    // Query all required DOM elements using class selectors
    const btn = document.querySelector(".language-btn");
    const dropdown = document.querySelector(".language-dropdown");
    const icon = document.querySelector(".icon-svg.is-language");

    // Validate DOM elements exist and are of correct type
    // Throws error if any required element is missing
    if (!(btn instanceof HTMLElement))
      throw new Error("Language button not found");
    if (!(dropdown instanceof HTMLElement))
      throw new Error("Language dropdown not found");
    if (!(icon instanceof SVGElement))
      throw new Error("Language icon not found");

    // Store validated elements as class properties
    this.languageBtn = btn;
    this.languageDropdown = dropdown;
    this.languageIcon = icon;

    // Start component initialization
    this.init();
  }

  // Initialize component by setting up all necessary event listeners
  private init(): void {
    this.setupEventListeners();
  }

  // Toggle dropdown visibility with animations
  // @param isOpen: boolean - Whether to open or close the dropdown
  private toggleDropdown(isOpen: boolean): void {
    if (!this.languageIcon || !this.languageBtn || !this.languageDropdown)
      return;

    // Rotate icon based on dropdown state
    gsap.to(this.languageIcon, {
      rotation: isOpen ? 180 : 0,
      duration: 0.4,
      ease: "power2.out",
    });

    // Change button background color based on state
    gsap.to(this.languageBtn, {
      backgroundColor: isOpen
        ? "var(--secondary--darkest)"
        : "var(--secondary--darker)",
      duration: 0.3,
    });

    if (isOpen) {
      // Show dropdown with fade and height animation
      gsap.set(this.languageDropdown, {
        visibility: "visible",
        height: 0,
        opacity: 0,
      });

      gsap.to(this.languageDropdown, {
        opacity: 1,
        height: "auto",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      // Hide dropdown with fade and height animation
      gsap.to(this.languageDropdown, {
        opacity: 0,
        height: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          if (this.languageDropdown) {
            gsap.set(this.languageDropdown, { visibility: "hidden" });
          }
        },
      });
    }
  }

  // Set up all event listeners for the language selector
  // Includes hover animations, click handling, and click-outside detection
  private setupEventListeners(): void {
    if (!this.languageBtn || !this.languageDropdown) return;

    // Handle mouse enter - expand button width
    this.languageBtn.addEventListener("mouseenter", () => {
      if (!this.languageBtn?.classList.contains("clicked")) {
        gsap.to(this.languageBtn, {
          width: "4.75rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    // Handle mouse leave - contract button width
    this.languageBtn.addEventListener("mouseleave", () => {
      if (!this.languageBtn?.classList.contains("clicked")) {
        gsap.to(this.languageBtn, {
          width: "2rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    });

    // Handle button click - toggle dropdown
    this.languageBtn.addEventListener("click", () => {
      const isClicked = this.languageBtn?.classList.toggle("clicked");
      this.toggleDropdown(!!isClicked);
    });

    // Handle clicks outside the dropdown - close if open
    document.addEventListener("click", (event) => {
      if (!this.languageBtn || !this.languageDropdown) return;

      const target = event.target as Element;
      const isInside =
        this.languageBtn.contains(target) ||
        this.languageDropdown.contains(target);
      const isDropdownTrigger = target.closest(".btn--nav-dropdown");

      // Close dropdown if click is outside or on another dropdown trigger
      if (
        (!isInside && this.languageBtn.classList.contains("clicked")) ||
        (isDropdownTrigger &&
          !this.languageDropdown.contains(isDropdownTrigger))
      ) {
        this.languageBtn.classList.remove("clicked");
        this.toggleDropdown(false);

        // Reset button styles
        gsap.to(this.languageBtn, {
          width: "2rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    });
  }
}
