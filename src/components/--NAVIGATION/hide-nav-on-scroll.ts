// Navigation
// Hide Nav on Scroll

export class HideNav {
  // Tracks the previous scroll position to determine direction
  private lastScrollTop: number = 0;

  // Reference to the navigation bar element
  private navbar: HTMLElement | null = null;

  // Amount user must scroll before triggering hide/show
  private readonly scrollThreshold: number = 50;

  // Screen width breakpoint for mobile devices (in pixels)
  private readonly mobileBreakpoint: number = 768;

  constructor() {
    // Wait for DOM to be ready before initializing
    document.addEventListener("DOMContentLoaded", () => {
      this.navbar = document.querySelector(".nav--bar");

      if (!this.navbar) {
        console.error("Navigation bar element not found!");
        return;
      }

      // Add smooth transition to the navbar
      this.navbar.style.transition = "transform 0.3s ease-in-out";

      // Add scroll event listener
      window.addEventListener("scroll", this.handleScroll, { passive: true });
    });
  }

  // Handles scroll events and determines whether to show/hide nav
  private handleScroll = (): void => {
    if (!this.navbar) return;

    // Only run on desktop
    if (window.innerWidth <= this.mobileBreakpoint) return;

    // Get current scroll position
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // Skip if haven't scrolled past threshold
    if (Math.abs(this.lastScrollTop - currentScroll) <= this.scrollThreshold)
      return;

    // Hide nav when scrolling down and not at the top
    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.navbar.style.transform = "translateY(-200%)";
    }
    // Show nav when scrolling up
    else {
      this.navbar.style.transform = "translateY(0)";
    }

    // Update last scroll position
    this.lastScrollTop = currentScroll;
  };
}
