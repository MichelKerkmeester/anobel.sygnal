// Navigation
// Mobile — Mega Menu

import lottie from "lottie-web";
import gsap from "gsap";

export class MegaMenu {
  // Main container for the mega menu
  private megaMenu: HTMLElement | null = null;

  // Hamburger button that toggles the menu
  private menuButton: HTMLElement | null = null;

  // Lottie animation instance for hamburger icon
  private lottieAnimation: any | null = null;

  // Tracks menu open/closed state
  private isOpen: boolean = false;

  constructor() {
    // Wait for DOM to be ready before initializing
    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  private init(): void {
    // Get references to required DOM elements
    this.megaMenu = document.querySelector(".nav--mega-menu");
    this.menuButton = document.querySelector(".btn--hamburger");

    // Exit if required elements aren't found
    if (!this.megaMenu || !this.menuButton) {
      console.error("Required mega menu elements not found!");
      return;
    }

    // Find container for Lottie animation
    const lottieContainer = document.querySelector(".lottie--hamburger");
    if (!lottieContainer) {
      console.error("Lottie container not found!");
      return;
    }

    // Initialize Lottie animation for hamburger icon
    this.lottieAnimation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6777ecd6636dc4314d954783_Icon%20-%20Hamburger%20Menu.json",
    });

    // Set up event handlers
    this.setupEventListeners();
  }

  // Opens the mega menu with animations
  private openMenu(): void {
    if (!this.megaMenu || !this.lottieAnimation) return;

    // Show menu container
    this.megaMenu.style.display = "flex";

    // Animate menu expansion
    gsap.to(this.megaMenu, {
      duration: 0.8,
      height: "100svh",
      width: "100%",
      ease: "power2.out",
      delay: 0.2,
      onComplete: () => {
        // Remove border radius after animation
        if (this.megaMenu) {
          this.megaMenu.style.borderRadius = "0rem";
        }
      },
    });

    // Play hamburger to close icon animation
    this.lottieAnimation.playSegments([0, 70], true);
  }

  // Closes the mega menu with animations
  private closeMenu(): void {
    if (!this.megaMenu || !this.lottieAnimation) return;

    // Restore border radius for closing animation
    this.megaMenu.style.borderRadius = "1rem";

    // Animate menu collapse
    gsap.to(this.megaMenu, {
      duration: 0.4,
      height: "0svh",
      width: "100%",
      ease: "power2.in",
      onComplete: () => {
        // Hide menu after animation
        if (this.megaMenu) {
          this.megaMenu.style.display = "none";
        }
      },
    });

    // Clean up previous animation listeners
    this.lottieAnimation.removeEventListener("complete");

    // Play close to hamburger icon animation
    this.lottieAnimation.playSegments([70, 140], true);

    // Reset animation when complete
    this.lottieAnimation.addEventListener("complete", () => {
      this.lottieAnimation.goToAndStop(0, true);
      this.lottieAnimation.removeEventListener("complete");
    });
  }

  // Sets up click handler for menu button
  private setupEventListeners(): void {
    if (!this.menuButton) return;

    // Toggle menu state on button click
    this.menuButton.addEventListener("click", () => {
      if (!this.isOpen) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
      this.isOpen = !this.isOpen;
    });
  }
}
