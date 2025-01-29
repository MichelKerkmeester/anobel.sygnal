/*
 * Site
 */

import { IModule, Page } from "@sygnal/sse";
import { HideNav } from "./components/--NAVIGATION/hide-nav-on-scroll";
import { DropdownMenu } from "./components/--NAVIGATION/dropdown-menu";
import { LanguageSelector } from "./components/--NAVIGATION/language-selector";
import { MegaMenu } from "./components/--NAVIGATION/mega-menu";

export class Site implements IModule {
  private hideNav!: HideNav;
  private dropdownMenu!: DropdownMenu;
  private languageSelector!: LanguageSelector;
  private megaMenu!: MegaMenu;

  constructor() {}

  /**
   * Setup code runs synchronously, inline, at the end of the </head>.
   * It's used for special init tasks that must be performed early, and which do not require
   * the DOM to be loaded.
   */
  setup() {
    Page.loadEngineCSS("site.css");
  }

  /**
   * Exec code runs after the DOM has processed.
   */
  exec() {
    console.log("Site: Initializing components...");

    // Initialize all navigation components
    this.hideNav = new HideNav();
    this.dropdownMenu = new DropdownMenu();
    this.languageSelector = new LanguageSelector();
    this.megaMenu = new MegaMenu();

    console.log("Site: Components initialized");
  }
}
