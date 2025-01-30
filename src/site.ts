/*
 * Site
 */

import { IModule, Page } from "@sygnal/sse";
import { Navigation } from "./components/Navigation";

// import gsap from 'gsap';

export class Site implements IModule {
  private navigation: Navigation;

  constructor() {}

  /**
   * Setup code runs synchronously, inline, at the end of the </head>.
   * It's used for special init tasks that must be performed early, and which do not require
   * the DOM to be loaded.
   */
  setup() {
    Page.loadEngineCSS("site.css");
    console.log("Site setup called");
  }

  /**
   * Exec code runs after the DOM has processed.
   */
  exec() {
    console.log("Site exec called");
    // Initialize navigation globally
    this.navigation = new Navigation();
    this.navigation.init();
  }
}

// Register the Site module with Sygnal
Page.register(new Site());
