// Marquee: Clients
// Swiper

import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export class Marquee {
  // Track all marquee instances
  private swipers: Swiper[] = [];

  constructor() {
    // Find all marquee elements
    const marqueeElements = document.querySelectorAll(".marquee--track");

    if (marqueeElements.length === 0) {
      console.warn("No marquee elements found on page");
      return;
    }

    // Initialize each marquee with Swiper
    marqueeElements.forEach((element) => {
      const swiper = new Swiper(element as HTMLElement, {
        modules: [Autoplay],
        wrapperClass: "marquee--container", // Wrapper container class
        slideClass: "marquee--item", // Individual slide class
        spaceBetween: 0, // No spacing (handled by CSS)
        allowTouchMove: false, // Disable touch/drag
        a11y: false, // Disable a11y for decorative content
        speed: 8000, // Animation duration in ms
        loop: true, // Enable infinite loop
        slidesPerView: "auto", // Auto-fit slides
        autoplay: {
          delay: 0, // No transition delay
          disableOnInteraction: false, // Keep running after interaction
        },
      });

      this.swipers.push(swiper);
    });
  }
}
