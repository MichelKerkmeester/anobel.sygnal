/*
 * Site
 */

import { IModule, Page } from "@sygnal/sse";

import { ScrollBehavior } from "./components/ScrollBehavior";
import { MegaMenu } from "./components/MegaMenu";
import { DropdownMenu } from "./components/DropdownMenu";
import { LanguageSelector } from "./components/LanguageSelector";

// import gsap from 'gsap';

export class Site implements IModule {
  private scrollBehavior: ScrollBehavior;
  private megaMenu: MegaMenu;
  private dropdownMenu: DropdownMenu;
  private languageSelector: LanguageSelector;

  constructor() {}

  /**
   * Setup code runs synchronously, inline, at the end of the </head>.
   */
  setup() {
    Page.loadEngineCSS("site.css");

    // Pre-initialize components
    this.scrollBehavior = new ScrollBehavior();
    this.megaMenu = new MegaMenu();
    this.dropdownMenu = new DropdownMenu();
    this.languageSelector = new LanguageSelector();
  }

  /**
   * Exec code runs after the DOM has processed.
   */
  exec() {
    // Initialize all components after DOM is ready
    this.scrollBehavior.init();
    this.megaMenu.init();
    this.dropdownMenu.init();
    this.languageSelector.init();
  }
}

// Register the Site module with Sygnal
Page.register(new Site());
