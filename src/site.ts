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
  private scrollBehavior: ScrollBehavior = new ScrollBehavior();
  private megaMenu: MegaMenu = new MegaMenu();
  private dropdownMenu: DropdownMenu = new DropdownMenu();
  private languageSelector: LanguageSelector = new LanguageSelector();

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
    // Initialize all components
    this.scrollBehavior = new ScrollBehavior();
    this.megaMenu = new MegaMenu();
    this.dropdownMenu = new DropdownMenu();
    this.languageSelector = new LanguageSelector();
  }
}
