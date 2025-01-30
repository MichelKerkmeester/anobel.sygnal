/**
 * Combined navigation scripts in TypeScript for use with Sygnal Framework & Webflow.
 * Original inline comments and functionality have been preserved.
 */

// Declare externally loaded libraries from Webflow
declare var gsap: any;
declare var lottie: any;

/**
 * Navigation component for Sygnal Framework & Webflow integration
 */
export class Navigation {
  // Declare class properties
  private lastScrollTop: number = 0;
  private navbar: HTMLElement | null = null;
  private readonly scrollThreshold: number = 50;
  private readonly mobileBreakpoint: number = 768;

  /**
   * Initialize the component
   */
  public init(): void {
    // Initialize elements once DOM is ready
    this.navbar = document.querySelector(".nav--bar");

    // Initialize all navigation features
    this.initScrollBehavior();
    this.initMegaMenu();
    this.initDropdowns();
    this.initLanguageSelector();
  }

  private initScrollBehavior(): void {
    // Add smooth transition to the navbar
    if (this.navbar) {
      this.navbar.style.transition = "transform 0.3s ease-in-out";
    }

    // Add scroll event listener
    window.addEventListener("scroll", this.handleScroll.bind(this), {
      passive: true,
    });
  }

  private initMegaMenu(): void {
    // Select all elements
    const megaMenu = document.querySelector(".nav--mega-menu");
    const menuButton = document.querySelector(".btn--hamburger");

    // Load Lottie animation
    const lottieAnimation = lottie.loadAnimation({
      container: document.querySelector(".lottie--hamburger"), // the dom element
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6777ecd6636dc4314d954783_Icon%20-%20Hamburger%20Menu.json",
    });

    // Function to open the menu
    function openMenu() {
      if (!megaMenu) return;
      megaMenu.style.display = "flex"; // Set display to flex before animation
      gsap.to(megaMenu, {
        duration: 0.8,
        height: "100svh",
        width: "100%",
        ease: "power2.out",
        delay: 0.2,
        onComplete: () => {
          megaMenu.style.borderRadius = "0rem";
        },
      });
      lottieAnimation.playSegments([0, 70], true);
    }

    // Function to close the menu
    function closeMenu() {
      if (!megaMenu) return;
      megaMenu.style.borderRadius = "1rem";
      gsap.to(megaMenu, {
        duration: 0.4,
        height: "0svh",
        width: "100%",
        ease: "power2.in",
        onComplete: () => {
          megaMenu.style.display = "none";
        },
      });

      // Remove any existing complete listeners first
      lottieAnimation.removeEventListener("complete");

      // Play the close animation
      lottieAnimation.playSegments([70, 140], true);

      // Add the complete listener
      lottieAnimation.addEventListener("complete", () => {
        lottieAnimation.goToAndStop(0, true);
        // Remove the listener after it executes to prevent memory leaks
        lottieAnimation.removeEventListener("complete");
      });
    }

    // Toggle menu on button click
    let isOpen = false;
    if (menuButton) {
      menuButton.addEventListener("click", () => {
        if (!isOpen) {
          openMenu();
        } else {
          closeMenu();
        }
        isOpen = !isOpen;
      });
    }
  }

  private initDropdowns(): void {
    // Select all dropdown containers
    const dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));

    if (!dropdowns.length) {
      console.error("No dropdown elements found in the DOM!");
    } else {
      // Select the main navigation container once
      const navigation = document.querySelector(".nav--bar");

      if (!navigation) {
        console.error("Navigation container (.navigation) not found!");
      } else {
        // Initialize dropdown data
        const dropdownData = dropdowns
          .map((dropdown) => {
            const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
            const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
            const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");

            if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
              console.warn(
                "Some required elements (dropdownToggle, dropdownMenu, dropdownIcon) are missing in a .nav--dropdown!"
              );
              return null;
            }

            return {
              dropdown,
              toggle: dropdownToggle, // Button that triggers dropdown
              dropdownMenu: dropdownMenu, // (Renamed from "menu" to "dropdownMenu")
              icon: dropdownIcon, // Rotation indicator for dropdown state
              isOpen: false, // Tracks if menu is visible
              animating: false, // Prevents interaction during animations
            };
          })
          .filter((d) => d !== null);

        /**
         * Utility function to create a GSAP timeline for opening a dropdown
         */
        const createOpenTimeline = (d: {
          dropdownMenu: HTMLElement;
          icon: HTMLElement;
          toggle: HTMLElement;
          animating: boolean;
        }) => {
          const tl = gsap.timeline({
            onStart: () => {
              d.animating = true;
            },
            onComplete: () => {
              d.animating = false;
            },
          });

          // Check if we're on desktop (window width > 768px)
          const isDesktop = window.matchMedia("(min-width: 768px)").matches;

          tl.fromTo(
            d.dropdownMenu,
            { opacity: 0, height: 0 },
            { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
          )
            .to(
              d.icon,
              { rotation: 180, duration: 0.3, ease: "power2.out" },
              "<"
            )
            .to(
              d.toggle,
              { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
              "<"
            );

          // Only add border radius animation on desktop
          if (isDesktop) {
            tl.to(
              navigation,
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
        };

        /**
         * Utility function to create a GSAP timeline for closing a dropdown
         */
        const createCloseTimeline = (d: {
          dropdownMenu: HTMLElement;
          icon: HTMLElement;
          toggle: HTMLElement;
          animating: boolean;
        }) => {
          const tl = gsap.timeline({
            onStart: () => {
              d.animating = true;
            },
            onComplete: () => {
              d.animating = false;
            },
          });

          // Check if we're on desktop (window width > 768px)
          const isDesktop = window.matchMedia("(min-width: 768px)").matches;

          tl.fromTo(
            d.dropdownMenu,
            { opacity: 1, height: d.dropdownMenu.scrollHeight },
            { opacity: 0, height: 0, duration: 0.3, ease: "power2.in" }
          )
            .to(d.icon, { rotation: 0, duration: 0.3, ease: "power2.in" }, "<")
            .to(d.toggle, { backgroundColor: "", duration: 0.3 }, "<");

          // Only add border radius animation on desktop
          if (isDesktop) {
            tl.to(
              navigation,
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
        };

        /**
         * Closes all open dropdowns except the specified one
         */
        const closeAllDropdowns = (except: any = null) => {
          dropdownData.forEach((d: any) => {
            if (d !== except && d.isOpen && !d.animating) {
              closeDropdown(d);
            }
          });
        };

        /**
         * Opens a specific dropdown
         */
        const openDropdown = (d: any) => {
          createOpenTimeline(d).play();
          d.isOpen = true;
        };

        /**
         * Closes a specific dropdown
         */
        const closeDropdown = (d: any) => {
          createCloseTimeline(d).play();
          d.isOpen = false;
        };

        // Attach event listeners to each dropdown toggle
        dropdownData.forEach((d: any) => {
          if (!d) return;
          d.toggle.addEventListener("click", () => {
            if (d.animating) return; // Prevent action if animating

            // Toggle the dropdown
            if (d.isOpen) {
              closeDropdown(d);
            } else {
              closeAllDropdowns(d); // Close others before opening
              openDropdown(d);
            }
          });
        });

        // Event listener to close dropdowns when clicking outside
        document.addEventListener("click", (e) => {
          dropdownData.forEach((d: any) => {
            if (d.isOpen && !d.animating) {
              const clickedInside =
                d.dropdown.contains(e.target) || d.toggle.contains(e.target);
              if (!clickedInside) {
                closeDropdown(d);
              }
            }
          });
        });

        // Close dropdowns when pressing the Escape key
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            closeAllDropdowns();
          }
        });
      }
    }
  }

  private initLanguageSelector(): void {
    // Selectors for the language button, dropdown, and rotating icon
    const languageBtn = document.querySelector('[class*="language--btn-w"]');
    const languageDropdown = document.querySelector(
      '[class*="language--dropdown-w"]'
    );
    const languageIcon = document.querySelector(".icon--svg.is--language");

    // Safety check to ensure required elements exist
    if (!languageBtn || !languageDropdown || !languageIcon) {
      console.error("Required elements not found!");
    } else {
      // Function to open or close the dropdown
      const toggleDropdown = (isOpen: boolean) => {
        // Rotate the language icon (0° closed, 180° open)
        gsap.to(languageIcon, {
          rotation: isOpen ? 180 : 0,
          duration: 0.4,
          ease: "power2.out",
        });

        // Toggle the button's background color based on state
        gsap.to(languageBtn, {
          backgroundColor: isOpen
            ? "var(--secondary--darkest)"
            : "var(--secondary--darker)",
          duration: 0.3,
        });

        if (isOpen) {
          // First set initial state
          gsap.set(languageDropdown, {
            visibility: "visible",
            height: 0,
            opacity: 0,
          });

          // Animate to final state
          gsap.to(languageDropdown, {
            opacity: 1,
            height: "auto",
            duration: 0.5,
            ease: "power3.out",
          });
        } else {
          // Animate back to closed state
          gsap.to(languageDropdown, {
            opacity: 0,
            height: 0,
            duration: 0.5,
            ease: "power3.in",
            onComplete: () => {
              gsap.set(languageDropdown, { visibility: "hidden" });
            },
          });
        }
      };

      // Hover effect: expand button width on hover in
      languageBtn.addEventListener("mouseenter", () => {
        if (!languageBtn.classList.contains("clicked")) {
          gsap.to(languageBtn, {
            width: "4.75rem",
            backgroundColor: "var(--secondary--darker)",
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });

      // Hover effect: collapse button width on hover out
      languageBtn.addEventListener("mouseleave", () => {
        if (!languageBtn.classList.contains("clicked")) {
          gsap.to(languageBtn, {
            width: "2rem",
            backgroundColor: "var(--secondary--darker)",
            duration: 0.3,
            ease: "power2.in",
          });
        }
      });

      // Click event: toggle dropdown open/close
      languageBtn.addEventListener("click", () => {
        const isClicked = languageBtn.classList.toggle("clicked");
        toggleDropdown(isClicked);
      });

      // Close dropdown if clicking outside the button or dropdown, or on another dropdown trigger
      document.addEventListener("click", (event) => {
        const target = event.target as Node | null;
        if (!target) return;

        const isInside =
          languageBtn.contains(target) || languageDropdown.contains(target);
        const isDropdownTrigger = (target as HTMLElement).closest(
          ".btn--nav-dropdown"
        );

        if (
          (!isInside && languageBtn.classList.contains("clicked")) ||
          (isDropdownTrigger && !languageDropdown.contains(isDropdownTrigger))
        ) {
          languageBtn.classList.remove("clicked");
          toggleDropdown(false);

          // Perform the hover-out action to reset the button width
          gsap.to(languageBtn, {
            width: "2rem",
            backgroundColor: "var(--secondary--darker)",
            duration: 0.3,
            ease: "power2.in",
          });
        }
      });
    }
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
      if (this.navbar) {
        this.navbar.style.transform = "translateY(-200%)";
      }
    }
    // Scrolling up
    else {
      if (this.navbar) {
        this.navbar.style.transform = "translateY(0)";
      }
    }

    this.lastScrollTop = currentScroll;
  }
}
