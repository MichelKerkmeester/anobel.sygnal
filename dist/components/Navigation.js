"use strict";
(() => {
  // src/components/Navigation.ts
  var Navigation = class {
    constructor() {
      this.lastScrollTop = 0;
      this.navbar = null;
      this.scrollThreshold = 50;
      this.mobileBreakpoint = 768;
    }
    init() {
      this.navbar = document.querySelector(".nav--bar");
      this.initScrollBehavior();
      this.initMegaMenu();
      this.initDropdowns();
      this.initLanguageSelector();
    }
    initScrollBehavior() {
      if (this.navbar) {
        this.navbar.style.transition = "transform 0.3s ease-in-out";
      }
      window.addEventListener("scroll", this.handleScroll.bind(this), {
        passive: true
      });
    }
    initMegaMenu() {
      const megaMenu = document.querySelector(".nav--mega-menu");
      const menuButton = document.querySelector(".btn--hamburger");
      const lottieAnimation = lottie.loadAnimation({
        container: document.querySelector(".lottie--hamburger"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6777ecd6636dc4314d954783_Icon%20-%20Hamburger%20Menu.json"
      });
      function openMenu() {
        if (!megaMenu)
          return;
        megaMenu.style.display = "flex";
        gsap.to(megaMenu, {
          duration: 0.8,
          height: "100svh",
          width: "100%",
          ease: "power2.out",
          delay: 0.2,
          onComplete: () => {
            megaMenu.style.borderRadius = "0rem";
          }
        });
        lottieAnimation.playSegments([0, 70], true);
      }
      function closeMenu() {
        if (!megaMenu)
          return;
        megaMenu.style.borderRadius = "1rem";
        gsap.to(megaMenu, {
          duration: 0.4,
          height: "0svh",
          width: "100%",
          ease: "power2.in",
          onComplete: () => {
            megaMenu.style.display = "none";
          }
        });
        lottieAnimation.removeEventListener("complete");
        lottieAnimation.playSegments([70, 140], true);
        lottieAnimation.addEventListener("complete", () => {
          lottieAnimation.goToAndStop(0, true);
          lottieAnimation.removeEventListener("complete");
        });
      }
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
    initDropdowns() {
      const dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));
      if (!dropdowns.length) {
        console.error("No dropdown elements found in the DOM!");
      } else {
        const navigation = document.querySelector(".nav--bar");
        if (!navigation) {
          console.error("Navigation container (.navigation) not found!");
        } else {
          const dropdownData = dropdowns.map((dropdown) => {
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
              toggle: dropdownToggle,
              dropdownMenu,
              icon: dropdownIcon,
              isOpen: false,
              animating: false
            };
          }).filter((d) => d !== null);
          const createOpenTimeline = (d) => {
            const tl = gsap.timeline({
              onStart: () => {
                d.animating = true;
              },
              onComplete: () => {
                d.animating = false;
              }
            });
            const isDesktop = window.matchMedia("(min-width: 768px)").matches;
            tl.fromTo(
              d.dropdownMenu,
              { opacity: 0, height: 0 },
              { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
            ).to(
              d.icon,
              { rotation: 180, duration: 0.3, ease: "power2.out" },
              "<"
            ).to(
              d.toggle,
              { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
              "<"
            );
            if (isDesktop) {
              tl.to(
                navigation,
                {
                  borderBottomLeftRadius: "0",
                  borderBottomRightRadius: "0",
                  duration: 0.3,
                  ease: "power2.out"
                },
                "<"
              );
            }
            return tl;
          };
          const createCloseTimeline = (d) => {
            const tl = gsap.timeline({
              onStart: () => {
                d.animating = true;
              },
              onComplete: () => {
                d.animating = false;
              }
            });
            const isDesktop = window.matchMedia("(min-width: 768px)").matches;
            tl.fromTo(
              d.dropdownMenu,
              { opacity: 1, height: d.dropdownMenu.scrollHeight },
              { opacity: 0, height: 0, duration: 0.3, ease: "power2.in" }
            ).to(d.icon, { rotation: 0, duration: 0.3, ease: "power2.in" }, "<").to(d.toggle, { backgroundColor: "", duration: 0.3 }, "<");
            if (isDesktop) {
              tl.to(
                navigation,
                {
                  borderBottomLeftRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                  duration: 0.3,
                  ease: "power2.in"
                },
                "<"
              );
            }
            return tl;
          };
          const closeAllDropdowns = (except = null) => {
            dropdownData.forEach((d) => {
              if (d !== except && d.isOpen && !d.animating) {
                closeDropdown(d);
              }
            });
          };
          const openDropdown = (d) => {
            createOpenTimeline(d).play();
            d.isOpen = true;
          };
          const closeDropdown = (d) => {
            createCloseTimeline(d).play();
            d.isOpen = false;
          };
          dropdownData.forEach((d) => {
            if (!d)
              return;
            d.toggle.addEventListener("click", () => {
              if (d.animating)
                return;
              if (d.isOpen) {
                closeDropdown(d);
              } else {
                closeAllDropdowns(d);
                openDropdown(d);
              }
            });
          });
          document.addEventListener("click", (e) => {
            dropdownData.forEach((d) => {
              if (d.isOpen && !d.animating) {
                const clickedInside = d.dropdown.contains(e.target) || d.toggle.contains(e.target);
                if (!clickedInside) {
                  closeDropdown(d);
                }
              }
            });
          });
          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              closeAllDropdowns();
            }
          });
        }
      }
    }
    initLanguageSelector() {
      const languageBtn = document.querySelector('[class*="language--btn-w"]');
      const languageDropdown = document.querySelector(
        '[class*="language--dropdown-w"]'
      );
      const languageIcon = document.querySelector(".icon--svg.is--language");
      if (!languageBtn || !languageDropdown || !languageIcon) {
        console.error("Required elements not found!");
      } else {
        const toggleDropdown = (isOpen) => {
          gsap.to(languageIcon, {
            rotation: isOpen ? 180 : 0,
            duration: 0.4,
            ease: "power2.out"
          });
          gsap.to(languageBtn, {
            backgroundColor: isOpen ? "var(--secondary--darkest)" : "var(--secondary--darker)",
            duration: 0.3
          });
          if (isOpen) {
            gsap.set(languageDropdown, {
              visibility: "visible",
              height: 0,
              opacity: 0
            });
            gsap.to(languageDropdown, {
              opacity: 1,
              height: "auto",
              duration: 0.5,
              ease: "power3.out"
            });
          } else {
            gsap.to(languageDropdown, {
              opacity: 0,
              height: 0,
              duration: 0.5,
              ease: "power3.in",
              onComplete: () => {
                gsap.set(languageDropdown, { visibility: "hidden" });
              }
            });
          }
        };
        languageBtn.addEventListener("mouseenter", () => {
          if (!languageBtn.classList.contains("clicked")) {
            gsap.to(languageBtn, {
              width: "4.75rem",
              backgroundColor: "var(--secondary--darker)",
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
        languageBtn.addEventListener("mouseleave", () => {
          if (!languageBtn.classList.contains("clicked")) {
            gsap.to(languageBtn, {
              width: "2rem",
              backgroundColor: "var(--secondary--darker)",
              duration: 0.3,
              ease: "power2.in"
            });
          }
        });
        languageBtn.addEventListener("click", () => {
          const isClicked = languageBtn.classList.toggle("clicked");
          toggleDropdown(isClicked);
        });
        document.addEventListener("click", (event) => {
          const target = event.target;
          if (!target)
            return;
          const isInside = languageBtn.contains(target) || languageDropdown.contains(target);
          const isDropdownTrigger = target.closest(
            ".btn--nav-dropdown"
          );
          if (!isInside && languageBtn.classList.contains("clicked") || isDropdownTrigger && !languageDropdown.contains(isDropdownTrigger)) {
            languageBtn.classList.remove("clicked");
            toggleDropdown(false);
            gsap.to(languageBtn, {
              width: "2rem",
              backgroundColor: "var(--secondary--darker)",
              duration: 0.3,
              ease: "power2.in"
            });
          }
        });
      }
    }
    handleScroll() {
      if (window.innerWidth <= this.mobileBreakpoint)
        return;
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (Math.abs(this.lastScrollTop - currentScroll) <= this.scrollThreshold)
        return;
      if (currentScroll > this.lastScrollTop && currentScroll > 50) {
        if (this.navbar) {
          this.navbar.style.transform = "translateY(-200%)";
        }
      } else {
        if (this.navbar) {
          this.navbar.style.transform = "translateY(0)";
        }
      }
      this.lastScrollTop = currentScroll;
    }
  };
})();
//# sourceMappingURL=Navigation.js.map
