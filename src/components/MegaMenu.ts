/**
 * MegaMenu component for mobile mega menu functionality.
 */
declare var gsap: any;
declare var lottie: any;

export class MegaMenu {
  private megaMenu: HTMLElement | null = null;
  private menuButton: HTMLElement | null = null;
  private lottieAnimation: any = null;
  private isOpen: boolean = false;

  public init(): void {
    this.megaMenu = document.querySelector(".nav--mega-menu");
    this.menuButton = document.querySelector(".btn--hamburger");

    if (!this.megaMenu || !this.menuButton) {
      console.error("Mega menu elements not found!");
      return;
    }

    // Load Lottie animation
    this.lottieAnimation = lottie.loadAnimation({
      container: document.querySelector(".lottie--hamburger"),
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6777ecd6636dc4314d954783_Icon%20-%20Hamburger%20Menu.json",
    });

    // Toggle menu on button click
    this.menuButton.addEventListener("click", this.toggleMenu.bind(this));
  }

  private toggleMenu(): void {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
    this.isOpen = !this.isOpen;
  }

  private openMenu(): void {
    if (!this.megaMenu) return;
    this.megaMenu.style.display = "flex"; // Set display to flex before animation
    gsap.to(this.megaMenu, {
      duration: 0.8,
      height: "100svh",
      width: "100%",
      ease: "power2.out",
      delay: 0.2,
      onComplete: () => {
        this.megaMenu!.style.borderRadius = "0rem";
      },
    });
    this.lottieAnimation.playSegments([0, 70], true);
  }

  private closeMenu(): void {
    if (!this.megaMenu) return;
    this.megaMenu.style.borderRadius = "1rem";
    gsap.to(this.megaMenu, {
      duration: 0.4,
      height: "0svh",
      width: "100%",
      ease: "power2.in",
      onComplete: () => {
        this.megaMenu!.style.display = "none";
      },
    });

    // Remove any existing complete listeners first
    this.lottieAnimation.removeEventListener("complete");

    // Play the close animation
    this.lottieAnimation.playSegments([70, 140], true);

    // Add the complete listener
    this.lottieAnimation.addEventListener("complete", () => {
      this.lottieAnimation.goToAndStop(0, true);
      // Remove the listener after it executes to prevent memory leaks
      this.lottieAnimation.removeEventListener("complete");
    });
  }
}
