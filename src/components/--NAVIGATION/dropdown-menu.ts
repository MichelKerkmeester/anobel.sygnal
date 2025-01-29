import gsap from 'gsap';

/**
 * Navigation class handles dropdown menu functionality
 * Manages animations and interactions for navigation dropdowns
 */
export class Navigation {
  // Stores all dropdown related data and elements
  private dropdownData: any[] = [];
  private navigation: Element | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Select all dropdown containers
    const dropdowns = Array.from(document.querySelectorAll('.nav--dropdown'));

    if (!dropdowns.length) {
      console.error('No dropdown elements found in the DOM!');
      return;
    }

    // Select the main navigation container once
    this.navigation = document.querySelector('.nav--bar');

    if (!this.navigation) {
      console.error('Navigation container (.navigation) not found!');
      return;
    }

    // Initialize dropdown data
    this.dropdownData = dropdowns
      .map((dropdown) => {
        const dropdownToggle = dropdown.querySelector('.btn--nav-dropdown');
        const dropdownMenu = dropdown.querySelector('.nav--dropdown-menu');
        const dropdownIcon = dropdown.querySelector('.icon--svg.is--nav');

        if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
          console.warn(
            'Some required elements (dropdownToggle, dropdownMenu, dropdownIcon) are missing in a .nav--dropdown!'
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

    this.attachEventListeners();
  }

  /**
   * Utility function to create a GSAP timeline for opening a dropdown
   */
  private createOpenTimeline(d: any): gsap.core.Timeline {
    const tl = gsap.timeline({
      onStart: () => { d.animating = true; },
      onComplete: () => { d.animating = false; }
    });

    // Check if we're on desktop (window width > 768px)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    tl.fromTo(
      d.dropdownMenu,
      { opacity: 0, height: 0 },
      { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
    )
      .to(d.icon, { rotation: 180, duration: 0.3, ease: 'power2.out' }, '<')
      .to(d.toggle, { backgroundColor: 'var(--secondary--darkest)', duration: 0.3 }, '<');

    // Only add border radius animation on desktop
    if (isDesktop && this.navigation) {
      tl.to(
        this.navigation,
        {
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          duration: 0.3,
          ease: 'power2.out',
        },
        '<'
      );
    }

    return tl;
  }

  /**
   * Utility function to create a GSAP timeline for closing a dropdown
   */
  private createCloseTimeline(d: any): gsap.core.Timeline {
    const tl = gsap.timeline({
      onStart: () => { d.animating = true; },
      onComplete: () => { d.animating = false; }
    });

    // Check if we're on desktop (window width > 768px)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    tl.fromTo(
      d.dropdownMenu,
      { opacity: 1, height: d.dropdownMenu.scrollHeight },
      { opacity: 0, height: 0, duration: 0.3, ease: 'power2.in' }
    )
      .to(d.icon, { rotation: 0, duration: 0.3, ease: 'power2.in' }, '<')
      .to(d.toggle, { backgroundColor: '', duration: 0.3 }, '<');

    // Only add border radius animation on desktop
    if (isDesktop && this.navigation) {
      tl.to(
        this.navigation,
        {
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
          duration: 0.3,
          ease: 'power2.in',
        },
        '<'
      );
    }

    return tl;
  }

  /**
   * Closes all open dropdowns except the specified one
   */
  private closeAllDropdowns(except: any = null): void {
    this.dropdownData.forEach((d) => {
      if (d !== except && d.isOpen && !d.animating) {
        this.closeDropdown(d);
      }
    });
  }

  /**
   * Opens a specific dropdown
   */
  private openDropdown(d: any): void {
    this.createOpenTimeline(d).play();
    d.isOpen = true;
  }

  /**
   * Closes a specific dropdown
   */
  private closeDropdown(d: any): void {
    this.createCloseTimeline(d).play();
    d.isOpen = false;
  }

  private attachEventListeners(): void {
    // Attach event listeners to each dropdown toggle
    this.dropdownData.forEach((d) => {
      d.toggle.addEventListener('click', () => {
        if (d.animating) return; // Prevent action if animating

        // Toggle the dropdown
        if (d.isOpen) {
          this.closeDropdown(d);
        } else {
          this.closeAllDropdowns(d); // Close others before opening
          this.openDropdown(d);
        }
      });
    });

    // Event listener to close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      this.dropdownData.forEach((d) => {
        if (d.isOpen && !d.animating) {
          const clickedInside = d.dropdown.contains(e.target) || d.toggle.contains(e.target);
          if (!clickedInside) {
            this.closeDropdown(d);
          }
        }
      });
    });

    // Close dropdowns when pressing the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });
  }
} 