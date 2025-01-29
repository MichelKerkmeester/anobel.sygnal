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
    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  private init(): void {
    // Get reference to navigation bar
    this.navbar = document.querySelector(".nav--bar");

    // Exit if navigation bar isn't found
    if (!this.navbar) {
      console.error("Navigation bar element not found!");
      return;
    }

    // Add smooth transition effect to transform property
    this.navbar.style.transition = "transform 0.3s ease-in-out";

    // Set up scroll event listener
    this.setupScrollListener();
  }

  // Handles scroll events and determines whether to show/hide nav
  private handleScroll = (): void => {
    if (!this.navbar) return;

    // Don't hide nav on mobile devices
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

  // Sets up scroll event listener with performance optimization
  private setupScrollListener(): void {
    // Use passive listener for better scroll performance
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }
}
