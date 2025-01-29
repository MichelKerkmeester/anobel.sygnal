import gsap from 'gsap';

export class LanguageSelector {
  private languageBtn: Element | null;
  private languageDropdown: Element | null;
  private languageIcon: Element | null;

  constructor() {
    // Initialize selectors with direct class names
    this.languageBtn = document.querySelector('.language--btn-w');
    this.languageDropdown = document.querySelector('.language--dropdown-w');
    this.languageIcon = document.querySelector('.icon--svg.is--language');

    // Safety check to ensure required elements exist
    if (!this.languageBtn || !this.languageDropdown || !this.languageIcon) {
      console.error('Required language selector elements not found!');
      return;
    }

    this.initialize();
  }

  private initialize(): void {
    this.attachEventListeners();
  }

  private toggleDropdown(isOpen: boolean): void {
    // Rotate the language icon (0° closed, 180° open)
    gsap.to(this.languageIcon, {
      rotation: isOpen ? 180 : 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Toggle the button's background color based on state
    gsap.to(this.languageBtn, {
      backgroundColor: isOpen
        ? 'var(--secondary--darkest)'
        : 'var(--secondary--darker)',
      duration: 0.3,
    });

    if (isOpen) {
      // First set initial state
      gsap.set(this.languageDropdown, {
        visibility: 'visible',
        height: 0,
        opacity: 0,
      });

      // Animate to final state
      gsap.to(this.languageDropdown, {
        opacity: 1,
        height: 'auto',
        duration: 0.5,
        ease: 'power3.out',
      });
    } else {
      // Animate back to closed state
      gsap.to(this.languageDropdown, {
        opacity: 0,
        height: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(this.languageDropdown, { visibility: 'hidden' });
        },
      });
    }
  }

  private attachEventListeners(): void {
    if (!this.languageBtn || !this.languageDropdown) return;

    // Hover effect: expand button width on hover in
    this.languageBtn.addEventListener('mouseenter', () => {
      if (!this.languageBtn?.classList.contains('clicked')) {
        gsap.to(this.languageBtn, {
          width: '4.75rem',
          backgroundColor: 'var(--secondary--darker)',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    // Hover effect: collapse button width on hover out
    this.languageBtn.addEventListener('mouseleave', () => {
      if (!this.languageBtn?.classList.contains('clicked')) {
        gsap.to(this.languageBtn, {
          width: '2rem',
          backgroundColor: 'var(--secondary--darker)',
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    });

    // Click event: toggle dropdown open/close
    this.languageBtn.addEventListener('click', () => {
      const isClicked = this.languageBtn?.classList.toggle('clicked');
      this.toggleDropdown(!!isClicked);
    });

    // Close dropdown if clicking outside the button or dropdown, or on another dropdown trigger
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      const isInside = this.languageBtn?.contains(target) || this.languageDropdown?.contains(target);
      const isDropdownTrigger = target.closest('.btn--nav-dropdown');

      if (
        (!isInside && this.languageBtn?.classList.contains('clicked')) ||
        (isDropdownTrigger && !this.languageDropdown?.contains(isDropdownTrigger))
      ) {
        this.languageBtn?.classList.remove('clicked');
        this.toggleDropdown(false);

        // Perform the hover-out action to reset the button width
        gsap.to(this.languageBtn, {
          width: '2rem',
          backgroundColor: 'var(--secondary--darker)',
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    });
  }
} 