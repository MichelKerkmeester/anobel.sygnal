/**
 * ScrollBehavior component for hiding the navbar on scroll.
 */
export class ScrollBehavior {
  private lastScrollTop: number = 0;
  private navbar: HTMLElement | null = null;
  private readonly scrollThreshold: number = 50; // Minimum scroll amount before hiding/showing
  private readonly mobileBreakpoint: number = 768; // Adjust based on your mobile breakpoint

  public init(): void {
    this.navbar = document.querySelector(".nav--bar");

    if (!this.navbar) {
      console.error("Navbar element (.nav--bar) not found!");
      return;
    }

    // Add smooth transition to the navbar
    this.navbar.style.transition = "transform 0.3s ease-in-out";

    // Add scroll event listener
    window.addEventListener("scroll", this.handleScroll.bind(this), {
      passive: true,
    });
  }

  private handleScroll(): void {
    // Only run on desktop
    if (window.innerWidth <= this.mobileBreakpoint) return;

    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // Check if user has scrolled more than threshold
    if (Math.abs(this.lastScrollTop - currentScroll) <= this.scrollThreshold)
      return;

    // Scrolling down & not at the top
    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.navbar!.style.transform = "translateY(-200%)";
    }
    // Scrolling up
    else {
      this.navbar!.style.transform = "translateY(0)";
    }

    this.lastScrollTop = currentScroll;
  }
}
