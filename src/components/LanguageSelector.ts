/**
 * LanguageSelector component for handling language selection dropdown.
 */
declare var gsap: any;

export class LanguageSelector {
  private languageBtn: HTMLElement | null = null;
  private languageDropdown: HTMLElement | null = null;
  private languageIcon: HTMLElement | null = null;

  public init(): void {
    this.languageBtn = document.querySelector('[class*="language--btn-w"]');
    this.languageDropdown = document.querySelector(
      '[class*="language--dropdown-w"]'
    );
    this.languageIcon = document.querySelector(".icon--svg.is--language");

    // Safety check to ensure required elements exist
    if (!this.languageBtn || !this.languageDropdown || !this.languageIcon) {
      console.error("Required elements not found!");
      return;
    }

    // Attach event listeners
    this.languageBtn.addEventListener(
      "mouseenter",
      this.handleMouseEnter.bind(this)
    );
    this.languageBtn.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );
    this.languageBtn.addEventListener("click", this.handleClick.bind(this));

    // Close dropdown if clicking outside the button or dropdown, or on another dropdown trigger
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  private toggleDropdown(isOpen: boolean): void {
    // Rotate the language icon (0° closed, 180° open)
    gsap.to(this.languageIcon, {
      rotation: isOpen ? 180 : 0,
      duration: 0.4,
      ease: "power2.out",
    });

    // Toggle the button's background color based on state
    gsap.to(this.languageBtn, {
      backgroundColor: isOpen
        ? "var(--secondary--darkest)"
        : "var(--secondary--darker)",
      duration: 0.3,
    });

    if (isOpen) {
      // First set initial state
      gsap.set(this.languageDropdown, {
        visibility: "visible",
        height: 0,
        opacity: 0,
      });

      // Animate to final state
      gsap.to(this.languageDropdown, {
        opacity: 1,
        height: "auto",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      // Animate back to closed state
      gsap.to(this.languageDropdown, {
        opacity: 0,
        height: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(this.languageDropdown, { visibility: "hidden" });
        },
      });
    }
  }

  private handleMouseEnter(): void {
    if (!this.languageBtn!.classList.contains("clicked")) {
      gsap.to(this.languageBtn, {
        width: "4.75rem",
        backgroundColor: "var(--secondary--darker)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }

  private handleMouseLeave(): void {
    if (!this.languageBtn!.classList.contains("clicked")) {
      gsap.to(this.languageBtn, {
        width: "2rem",
        backgroundColor: "var(--secondary--darker)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }

  private handleClick(): void {
    const isClicked = this.languageBtn!.classList.toggle("clicked");
    this.toggleDropdown(isClicked);
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!target) return;

    const isInside =
      this.languageBtn!.contains(target) ||
      this.languageDropdown!.contains(target);
    const isDropdownTrigger = (target as HTMLElement).closest(
      ".btn--nav-dropdown"
    );

    if (
      (!isInside && this.languageBtn!.classList.contains("clicked")) ||
      (isDropdownTrigger && !this.languageDropdown!.contains(isDropdownTrigger))
    ) {
      this.languageBtn!.classList.remove("clicked");
      this.toggleDropdown(false);

      // Reset the button width
      gsap.to(this.languageBtn, {
        width: "2rem",
        backgroundColor: "var(--secondary--darker)",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }
}
