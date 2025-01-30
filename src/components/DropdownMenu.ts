/**
 * DropdownMenu component for handling navigation dropdown menus.
 */
declare var gsap: any;

export class DropdownMenu {
  private dropdowns: HTMLElement[] = [];
  private navigation: HTMLElement | null = null;
  private dropdownData: any[] = [];

  public init(): void {
    this.dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));

    if (!this.dropdowns.length) {
      console.error("No dropdown elements found in the DOM!");
      return;
    }

    this.navigation = document.querySelector(".nav--bar");

    if (!this.navigation) {
      console.error("Navigation container (.nav--bar) not found!");
      return;
    }

    // Initialize dropdown data
    this.dropdownData = this.dropdowns
      .map((dropdown) => {
        const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
        const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
        const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");

        if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
          console.warn(
            "Some required elements are missing in a .nav--dropdown!"
          );
          return null;
        }

        return {
          dropdown,
          toggle: dropdownToggle as HTMLElement,
          dropdownMenu: dropdownMenu as HTMLElement,
          icon: dropdownIcon as HTMLElement,
          isOpen: false,
          animating: false,
        };
      })
      .filter((d) => d !== null);

    // Attach event listeners to each dropdown toggle
    this.dropdownData.forEach((d: any) => {
      if (!d) return;
      d.toggle.addEventListener("click", () => {
        if (d.animating) return;
        if (d.isOpen) {
          this.closeDropdown(d);
        } else {
          this.closeAllDropdowns(d);
          this.openDropdown(d);
        }
      });
    });

    // Event listener to close dropdowns when clicking outside
    document.addEventListener("click", this.handleDocumentClick.bind(this));

    // Close dropdowns when pressing the Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllDropdowns();
      }
    });
  }

  private createOpenTimeline(d: any): gsap.core.Timeline {
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
      .to(d.icon, { rotation: 180, duration: 0.3, ease: "power2.out" }, "<")
      .to(
        d.toggle,
        { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
        "<"
      );

    // Only add border radius animation on desktop
    if (isDesktop) {
      tl.to(
        this.navigation,
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
  }

  private createCloseTimeline(d: any): gsap.core.Timeline {
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
        this.navigation,
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
  }

  private closeAllDropdowns(except: any = null): void {
    this.dropdownData.forEach((d: any) => {
      if (d !== except && d.isOpen && !d.animating) {
        this.closeDropdown(d);
      }
    });
  }

  private openDropdown(d: any): void {
    this.createOpenTimeline(d).play();
    d.isOpen = true;
  }

  private closeDropdown(d: any): void {
    this.createCloseTimeline(d).play();
    d.isOpen = false;
  }

  private handleDocumentClick(e: MouseEvent): void {
    this.dropdownData.forEach((d: any) => {
      if (d.isOpen && !d.animating) {
        const clickedInside =
          d.dropdown.contains(e.target) || d.toggle.contains(e.target);
        if (!clickedInside) {
          this.closeDropdown(d);
        }
      }
    });
  }
}
