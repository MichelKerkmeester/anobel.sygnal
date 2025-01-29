// Navigation
// Dropdown Menu

import gsap from "gsap";

export class DropdownMenu {
  // Stores all dropdown related data and elements
  private dropdownData: any[] = [];

  // Main navigation container reference
  private navigation: Element | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Find all dropdown containers in the navigation
    const dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));

    // Early return if no dropdowns found
    if (!dropdowns.length) {
      console.error("No dropdown elements found in the DOM!");
      return;
    }

    // Get main navigation container for border radius animations
    this.navigation = document.querySelector(".nav--bar");

    if (!this.navigation) {
      console.error("Navigation container (.navigation) not found!");
      return;
    }

    // Process each dropdown and store its elements and state
    this.dropdownData = dropdowns
      .map((dropdown) => {
        const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
        const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
        const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");

        // Skip if any required elements are missing
        if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
          console.warn("Missing required elements in dropdown");
          return null;
        }

        // Return structured data for this dropdown
        return {
          dropdown, // Main container element
          toggle: dropdownToggle, // Button that triggers dropdown
          dropdownMenu: dropdownMenu, // Menu container element
          icon: dropdownIcon, // Rotation indicator icon
          isOpen: false, // Tracks menu visibility state
          animating: false, // Prevents interaction during animations
        };
      })
      .filter((d) => d !== null);

    this.attachEventListeners();
  }

  // Creates animation timeline for opening a dropdown
  // Handles icon rotation, menu visibility, and navigation border radius
  private createOpenTimeline(d: any): gsap.core.Timeline {
    const tl = gsap.timeline({
      onStart: () => {
        d.animating = true;
      },
      onComplete: () => {
        d.animating = false;
      },
    });

    // Check viewport size for responsive behavior
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // Animate menu appearance and icon rotation
    tl.fromTo(
      d.dropdownMenu,
      { opacity: 0, height: 0 },
      { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
    )
      .to(d.icon, { rotation: 180, duration: 0.3, ease: "power2.out" }, "<")
      .to(
        d.toggle,
        { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
        "<"
      );

    // Desktop-only: Adjust navigation border radius
    if (isDesktop && this.navigation) {
      tl.to(
        this.navigation,
        {
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
          duration: 0.3,
          ease: "power2.out",
        },
        "<"
      );
    }

    return tl;
  }

  // Creates animation timeline for closing a dropdown
  // Reverses all animations from open timeline
  private createCloseTimeline(d: any): gsap.core.Timeline {
    const tl = gsap.timeline({
      onStart: () => {
        d.animating = true;
      },
      onComplete: () => {
        d.animating = false;
      },
    });

    // Check viewport size for responsive behavior
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // Animate menu disappearance and icon rotation
    tl.fromTo(
      d.dropdownMenu,
      { opacity: 1, height: d.dropdownMenu.scrollHeight },
      { opacity: 0, height: 0, duration: 0.3, ease: "power2.in" }
    )
      .to(d.icon, { rotation: 0, duration: 0.3, ease: "power2.in" }, "<")
      .to(d.toggle, { backgroundColor: "", duration: 0.3 }, "<");

    // Desktop-only: Reset navigation border radius
    if (isDesktop && this.navigation) {
      tl.to(
        this.navigation,
        {
          borderBottomLeftRadius: "1rem",
          borderBottomRightRadius: "1rem",
          duration: 0.3,
          ease: "power2.in",
        },
        "<"
      );
    }

    return tl;
  }

  // Closes all open dropdowns except the specified one
  // Used when opening a new dropdown to close others
  private closeAllDropdowns(except: any = null): void {
    this.dropdownData.forEach((d) => {
      if (d !== except && d.isOpen && !d.animating) {
        this.closeDropdown(d);
      }
    });
  }

  // Opens a specific dropdown with animation
  private openDropdown(d: any): void {
    this.createOpenTimeline(d).play();
    d.isOpen = true;
  }

  // Closes a specific dropdown with animation
  private closeDropdown(d: any): void {
    this.createCloseTimeline(d).play();
    d.isOpen = false;
  }

  // Sets up all event listeners for dropdown functionality
  private attachEventListeners(): void {
    // Handle clicks on dropdown toggles
    this.dropdownData.forEach((d) => {
      d.toggle.addEventListener("click", () => {
        // Prevent interaction during animation
        if (d.animating) return;

        // Toggle dropdown state
        if (d.isOpen) {
          this.closeDropdown(d);
        } else {
          this.closeAllDropdowns(d); // Close others first
          this.openDropdown(d);
        }
      });
    });

    // Handle clicks outside dropdowns
    document.addEventListener("click", (e) => {
      this.dropdownData.forEach((d) => {
        if (d.isOpen && !d.animating) {
          const clickedInside =
            d.dropdown.contains(e.target) || d.toggle.contains(e.target);
          if (!clickedInside) {
            this.closeDropdown(d);
          }
        }
      });
    });

    // Handle Escape key to close all dropdowns
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllDropdowns();
      }
    });
  }
}
