/*
 * SITE
 * Main entry point
 *
 * https://engine.sygnal.com/
 *
 * ENGINE MODE
 * ?engine.mode=dev
 * ?engine.mode=prod
 *
 */

import { RouteDispatcher } from "@sygnal/sse";
import { Site } from "./site";
import { HomePage } from "./pages/home";
import { DienstenPage } from "./pages/diensten";

export const routeDispatcher = (): RouteDispatcher => {
  var routeDispatcher = new RouteDispatcher(Site);
  routeDispatcher.routes = {
    // Site pages
    "/": HomePage,
    "/diensten": DienstenPage,
  };

  return routeDispatcher;
};
