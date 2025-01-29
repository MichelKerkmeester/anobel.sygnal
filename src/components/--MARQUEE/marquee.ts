// Marquee: Clients
// Swiper

import gsap from "gsap";

export class Marquee {
  // Track all marquee instances on the page
  private marquees: HTMLElement[] = [];

  constructor() {
    // Find all marquee elements with the correct class
    this.marquees = Array.from(document.querySelectorAll(".marquee--track"));

    if (this.marquees.length === 0) {
      console.warn("No marquee elements found on page");
      return;
    }

    this.init();
  }

  private init(): void {
    this.marquees.forEach((marquee) => {
      // Get the content wrapper inside the track
      const content = marquee.querySelector(".marquee--content");
      if (!content) {
        console.warn("Marquee content element not found");
        return;
      }

      // Clone the content for infinite scroll effect
      const clone = content.cloneNode(true);
      marquee.appendChild(clone);

      // Set up the animation
      gsap.to(marquee, {
        x: "-50%",
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    });
  }
}
