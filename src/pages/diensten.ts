// Page: Diensten

import { IModule } from "@sygnal/sse";
import { Marquee } from "../components/--MARQUEE/marquee";
// Import page-specific styles
import "./diensten.scss";

export class DienstenPage implements IModule {
  private marquee: Marquee | null = null;

  constructor() {}

  setup() {}

  exec() {
    // Initialize marquee after DOM is ready
    this.marquee = new Marquee();
  }
}
