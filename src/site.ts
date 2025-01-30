/*
 * Site Module
 * Handles initialization and coordination of core site components
 */

import { IModule, Page } from "@sygnal/sse";

// Component imports
import { ScrollBehavior } from "./components/ScrollBehavior";
import { MegaMenu } from "./components/MegaMenu";
import { DropdownMenu } from "./components/DropdownMenu";
import { LanguageSelector } from "./components/LanguageSelector";

// import gsap from 'gsap';

export class Site implements IModule {
  // Component instances
  private scrollBehavior: ScrollBehavior;
  private megaMenu: MegaMenu;
  private dropdownMenu: DropdownMenu;
  private languageSelector: LanguageSelector;

  constructor() {}

  /**
   * Setup runs synchronously at </head>
   * Initialize all components early
   */
  setup(): void {
    // Load required styles
    Page.loadEngineCSS("site.css");

    // Initialize all components
    this.scrollBehavior = new ScrollBehavior();
    this.scrollBehavior.init();

    this.megaMenu = new MegaMenu();
    this.megaMenu.init();

    this.dropdownMenu = new DropdownMenu();
    this.dropdownMenu.init();

    this.languageSelector = new LanguageSelector();
    this.languageSelector.init();
  }

  /**
   * Exec runs after DOM is ready
   * Left empty as all initialization is done in setup
   */
  exec(): void {}
}

// Register Site module
Page.register(new Site());
