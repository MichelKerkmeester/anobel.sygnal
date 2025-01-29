// Marquee: Clients
// Swiper

import Swiper from "swiper";
import { Autoplay } from "swiper/modules";

export class Marquee {
  private swiper: Swiper | null = null;

  constructor() {
    this.initSwiper();
  }

  private initSwiper(): void {
    const track = document.querySelector(".marquee--track");
    if (!track) {
      console.error("Marquee track element not found");
      return;
    }

    this.swiper = new Swiper(".marquee--track", {
      modules: [Autoplay],
      wrapperClass: "marquee--container", // Wrapper container class
      slideClass: "marquee--item", // Individual slide class
      spaceBetween: 0, // No spacing (handled by CSS)
      allowTouchMove: false, // Disable touch/drag
      a11y: {
        enabled: false,
      },
      speed: 5000, // Animation duration in ms
      loop: true, // Enable infinite loop
      slidesPerView: "auto", // Auto-fit slides
      autoplay: {
        delay: 0, // No transition delay
        disableOnInteraction: false, // Keep running after interaction
      },
    });
  }
}
