// Navigation
// Hide Nav on Scroll
import gsap from "gsap";

export class HideNav {
  // Track the last scroll position
  private lastScrollTop: number = 0;
  private navbar: HTMLElement | null = null;
  // Minimum scroll amount before hiding/showing
  private readonly scrollThreshold: number = 50;
  // Adjust this based on your mobile breakpoint
  private readonly mobileBreakpoint: number = 768;

  constructor() {
    // Initialize immediately and listen for Sygnal page changes
    this.init();

    // Listen for Sygnal page transitions
    document.addEventListener("sygnal:load", () => {
      this.init();
    });

    // Backup: also listen for Webflow page transitions
    window.Webflow &&
      window.Webflow.push(() => {
        this.init();
      });
  }

  private init(): void {
    // Try Webflow's default navigation classes
    this.navbar = document.querySelector(
      ".navbar, .nav-bar, [data-animation='navbar']"
    );

    if (!this.navbar) {
      console.warn(
        "First attempt to find navbar failed, trying secondary selectors..."
      );
      // Try secondary selectors specific to the Nobel site
      this.navbar = document.querySelector("nav, .w-nav, .navigation");
    }

    if (!this.navbar) {
      console.error(
        "Navigation bar element not found! Available classes:",
        document.querySelector("nav")?.classList
      );
      return;
    }

    // Remove the CSS transition since we'll use GSAP
    this.navbar.style.transition = "none";

    // Set initial GSAP state
    gsap.set(this.navbar, {
      y: 0,
      force3D: true,
    });

    this.setupScrollListener();
  }

  private handleScroll = (): void => {
    // Only run on desktop
    if (window.innerWidth <= this.mobileBreakpoint) return;

    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // Check if user has scrolled more than threshold
    if (Math.abs(this.lastScrollTop - currentScroll) <= this.scrollThreshold)
      return;

    // Scrolling down & not at the top
    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      gsap.to(this.navbar, {
        y: "-100%",
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
    // Scrolling up
    else {
      gsap.to(this.navbar, {
        y: "0%",
        duration: 0.3,
        ease: "power2.out",
      });
    }

    this.lastScrollTop = currentScroll;
  };

  private setupScrollListener(): void {
    // Add scroll event listener with passive flag for better performance
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }
}
