"use strict";
(() => {
  // node_modules/@sygnal/sse/dist/script.js
  var ScriptElement = class extends HTMLScriptElement {
    constructor(src, config) {
      super();
      this.src = src;
      if (config) {
        if (config.type) {
          this.type = config.type;
        }
        if (config.id) {
          this.id = config.id;
        }
        if (config.async !== void 0) {
          this.async = config.async;
        }
        if (config.defer !== void 0) {
          this.defer = config.defer;
        }
        if (config.customAttributes) {
          for (const [key, value] of Object.entries(config.customAttributes)) {
            this.setAttribute(key, value);
          }
        }
      }
    }
    appendTo(target = "body") {
      const parent = target === "head" ? document.head : document.body;
      parent.appendChild(this);
    }
    prependTo(target = "body") {
      const parent = target === "head" ? document.head : document.body;
      parent.prepend(this);
    }
  };
  customElements.define("custom-script", ScriptElement, { extends: "script" });

  // node_modules/@sygnal/sse/dist/page.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Page = class {
    static loadCSS(url) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
    static loadEngineCSS(cssFileName) {
      let libPath = window.SSE.baseUrl;
      const cssURL = `${libPath}/css/${cssFileName}`;
      this.loadCSS(cssURL);
    }
    static loadStyle(css) {
      const style = document.createElement("style");
      style.innerText = css;
      document.head.appendChild(style);
    }
    static replaceScriptSource(element, newSrc) {
      element.src = newSrc;
    }
    static replaceCSSLink(element, newHref) {
      element.href = newHref;
    }
    static prependToTitle(text) {
      document.title = `${text}${document.title}`;
    }
    static getCurrentScriptUrl() {
      if (document.currentScript) {
        const currentScript = document.currentScript;
        return currentScript.src;
      }
      console.error("document.currentScript is not supported in this browser.");
      return null;
    }
    static getCurrentScriptBaseUrl() {
      const currentScript = document.currentScript;
      if (currentScript) {
        const scriptURL = new URL(currentScript.src);
        const origin = scriptURL.origin;
        const path = scriptURL.pathname.substring(0, scriptURL.pathname.lastIndexOf("/"));
        const baseURL = `${origin}${path}`;
        return baseURL;
      } else {
        console.error("Unable to determine the currently executing script.");
      }
      return void 0;
    }
    static findAncestorWithAttribute(element, attributeName) {
      let currentElement = element;
      while (currentElement) {
        if (currentElement.hasAttribute(attributeName)) {
          return currentElement;
        }
        currentElement = currentElement.parentElement;
      }
      return null;
    }
    static getAncestorAttributeValue(element, attributeName) {
      let currentElement = element;
      while (currentElement) {
        if (currentElement.hasAttribute(attributeName)) {
          return currentElement.getAttribute(attributeName);
        }
        currentElement = currentElement.parentElement;
      }
      return null;
    }
    static hasAncestorWithAttribute(element, attributeName) {
      return this.findAncestorWithAttribute(element, attributeName) !== null;
    }
    static convertToPixels(value, contextElement = document.documentElement) {
      const match = value.match(/^(-?\d+\.?\d*)(rem|em|px|vh|vw|%)$/);
      if (!match)
        throw new Error("Invalid value format");
      const [, amountStr, unit] = match;
      const amount = parseFloat(amountStr);
      switch (unit) {
        case "px":
          return amount;
        case "rem":
          return amount * parseFloat(getComputedStyle(document.documentElement).fontSize);
        case "em":
          return amount * parseFloat(getComputedStyle(contextElement).fontSize);
        case "vh":
          return amount * window.innerHeight / 100;
        case "vw":
          return amount * window.innerWidth / 100;
        case "%":
          return amount * contextElement.clientWidth / 100;
        default:
          throw new Error("Unsupported unit");
      }
    }
    static getResponseHeader(headerName, url = void 0) {
      return __awaiter(this, void 0, void 0, function* () {
        const headers = yield this.getResponseHeaders(url);
        if (!headers)
          return void 0;
        if (!headers.has(headerName))
          return void 0;
        return headers.get(headerName) || void 0;
      });
    }
    static getResponseHeaders(url = void 0) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          if (!url) {
            url = window.location.href;
          }
          const response = yield fetch(url, {
            method: "HEAD"
          });
          return response.headers;
        } catch (error) {
          console.error("Error checking reverse proxy header:", error);
        }
        return void 0;
      });
    }
  };
  Page.Head = class {
    static loadScript(src, config) {
      const script = new ScriptElement(src, config);
      script.appendTo("head");
    }
  };
  Page.Body = class {
    static loadScript(src, config) {
      const script = new ScriptElement(src, config);
      script.appendTo("body");
    }
  };

  // node_modules/js-cookie/dist/js.cookie.mjs
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }
  var defaultConverter = {
    read: function(value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      );
    }
  };
  function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
      if (typeof document === "undefined") {
        return;
      }
      attributes = assign({}, defaultAttributes, attributes);
      if (typeof attributes.expires === "number") {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }
      name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var stringifiedAttributes = "";
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += "; " + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }
        stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
      }
      return document.cookie = name + "=" + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
      if (typeof document === "undefined" || arguments.length && !name) {
        return;
      }
      var cookies = document.cookie ? document.cookie.split("; ") : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split("=");
        var value = parts.slice(1).join("=");
        try {
          var found = decodeURIComponent(parts[0]);
          jar[found] = converter.read(value, found);
          if (name === found) {
            break;
          }
        } catch (e) {
        }
      }
      return name ? jar[name] : jar;
    }
    return Object.create(
      {
        set,
        get,
        remove: function(name, attributes) {
          set(
            name,
            "",
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function(attributes) {
          return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter2) {
          return init(assign({}, this.converter, converter2), this.attributes);
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    );
  }
  var api = init(defaultConverter, { path: "/" });

  // src/components/ScrollBehavior.ts
  var ScrollBehavior = class {
    constructor() {
      this.lastScrollTop = 0;
      this.navbar = null;
      this.scrollThreshold = 50;
      this.mobileBreakpoint = 768;
    }
    init() {
      this.navbar = document.querySelector(".nav--bar");
      if (!this.navbar) {
        console.error("Navbar element (.nav--bar) not found!");
        return;
      }
      this.navbar.style.transition = "transform 0.3s ease-in-out";
      window.addEventListener("scroll", this.handleScroll.bind(this), {
        passive: true
      });
    }
    handleScroll() {
      if (window.innerWidth <= this.mobileBreakpoint)
        return;
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (Math.abs(this.lastScrollTop - currentScroll) <= this.scrollThreshold)
        return;
      if (currentScroll > this.lastScrollTop && currentScroll > 50) {
        this.navbar.style.transform = "translateY(-200%)";
      } else {
        this.navbar.style.transform = "translateY(0)";
      }
      this.lastScrollTop = currentScroll;
    }
  };

  // src/components/MegaMenu.ts
  var MegaMenu = class {
    constructor() {
      this.megaMenu = null;
      this.menuButton = null;
      this.lottieAnimation = null;
      this.isOpen = false;
    }
    init() {
      this.megaMenu = document.querySelector(".nav--mega-menu");
      this.menuButton = document.querySelector(".btn--hamburger");
      if (!this.megaMenu || !this.menuButton) {
        console.error("Mega menu elements not found!");
        return;
      }
      this.lottieAnimation = lottie.loadAnimation({
        container: document.querySelector(".lottie--hamburger"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6777ecd6636dc4314d954783_Icon%20-%20Hamburger%20Menu.json"
      });
      this.menuButton.addEventListener("click", this.toggleMenu.bind(this));
    }
    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
      this.isOpen = !this.isOpen;
    }
    openMenu() {
      if (!this.megaMenu)
        return;
      this.megaMenu.style.display = "flex";
      gsap.to(this.megaMenu, {
        duration: 0.8,
        height: "100svh",
        width: "100%",
        ease: "power2.out",
        delay: 0.2,
        onComplete: () => {
          this.megaMenu.style.borderRadius = "0rem";
        }
      });
      this.lottieAnimation.playSegments([0, 70], true);
    }
    closeMenu() {
      if (!this.megaMenu)
        return;
      this.megaMenu.style.borderRadius = "1rem";
      gsap.to(this.megaMenu, {
        duration: 0.4,
        height: "0svh",
        width: "100%",
        ease: "power2.in",
        onComplete: () => {
          this.megaMenu.style.display = "none";
        }
      });
      this.lottieAnimation.removeEventListener("complete");
      this.lottieAnimation.playSegments([70, 140], true);
      this.lottieAnimation.addEventListener("complete", () => {
        this.lottieAnimation.goToAndStop(0, true);
        this.lottieAnimation.removeEventListener("complete");
      });
    }
  };

  // src/components/DropdownMenu.ts
  var DropdownMenu = class {
    constructor() {
      this.dropdowns = [];
      this.navigation = null;
      this.dropdownData = [];
    }
    init() {
      this.dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));
      if (!this.dropdowns.length) {
        console.error("No dropdown elements found in the DOM!");
        return;
      }
      this.navigation = document.querySelector(".nav--bar");
      if (!this.navigation) {
        console.error("Navigation container (.nav--bar) not found!");
        return;
      }
      this.dropdownData = this.dropdowns.map((dropdown) => {
        const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
        const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
        const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");
        if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
          console.warn(
            "Some required elements are missing in a .nav--dropdown!"
          );
          return null;
        }
        return {
          dropdown,
          toggle: dropdownToggle,
          dropdownMenu,
          icon: dropdownIcon,
          isOpen: false,
          animating: false
        };
      }).filter((d) => d !== null);
      this.dropdownData.forEach((d) => {
        if (!d)
          return;
        d.toggle.addEventListener("click", () => {
          if (d.animating)
            return;
          if (d.isOpen) {
            this.closeDropdown(d);
          } else {
            this.closeAllDropdowns(d);
            this.openDropdown(d);
          }
        });
      });
      document.addEventListener("click", this.handleDocumentClick.bind(this));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeAllDropdowns();
        }
      });
    }
    createOpenTimeline(d) {
      const tl = gsap.timeline({
        onStart: () => {
          d.animating = true;
        },
        onComplete: () => {
          d.animating = false;
        }
      });
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      tl.fromTo(
        d.dropdownMenu,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
      ).to(d.icon, { rotation: 180, duration: 0.3, ease: "power2.out" }, "<").to(
        d.toggle,
        { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
        "<"
      );
      if (isDesktop) {
        tl.to(
          this.navigation,
          {
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
            duration: 0.3,
            ease: "power2.out"
          },
          "<"
        );
      }
      return tl;
    }
    createCloseTimeline(d) {
      const tl = gsap.timeline({
        onStart: () => {
          d.animating = true;
        },
        onComplete: () => {
          d.animating = false;
        }
      });
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      tl.fromTo(
        d.dropdownMenu,
        { opacity: 1, height: d.dropdownMenu.scrollHeight },
        { opacity: 0, height: 0, duration: 0.3, ease: "power2.in" }
      ).to(d.icon, { rotation: 0, duration: 0.3, ease: "power2.in" }, "<").to(d.toggle, { backgroundColor: "", duration: 0.3 }, "<");
      if (isDesktop) {
        tl.to(
          this.navigation,
          {
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
            duration: 0.3,
            ease: "power2.in"
          },
          "<"
        );
      }
      return tl;
    }
    closeAllDropdowns(except = null) {
      this.dropdownData.forEach((d) => {
        if (d !== except && d.isOpen && !d.animating) {
          this.closeDropdown(d);
        }
      });
    }
    openDropdown(d) {
      this.createOpenTimeline(d).play();
      d.isOpen = true;
    }
    closeDropdown(d) {
      this.createCloseTimeline(d).play();
      d.isOpen = false;
    }
    handleDocumentClick(e) {
      this.dropdownData.forEach((d) => {
        if (d.isOpen && !d.animating) {
          const clickedInside = d.dropdown.contains(e.target) || d.toggle.contains(e.target);
          if (!clickedInside) {
            this.closeDropdown(d);
          }
        }
      });
    }
  };

  // src/components/LanguageSelector.ts
  var LanguageSelector = class {
    constructor() {
      this.languageBtn = null;
      this.languageDropdown = null;
      this.languageIcon = null;
    }
    init() {
      this.languageBtn = document.querySelector('[class*="language--btn-w"]');
      this.languageDropdown = document.querySelector(
        '[class*="language--dropdown-w"]'
      );
      this.languageIcon = document.querySelector(".icon--svg.is--language");
      if (!this.languageBtn || !this.languageDropdown || !this.languageIcon) {
        console.error("Required elements not found!");
        return;
      }
      this.languageBtn.addEventListener(
        "mouseenter",
        this.handleMouseEnter.bind(this)
      );
      this.languageBtn.addEventListener(
        "mouseleave",
        this.handleMouseLeave.bind(this)
      );
      this.languageBtn.addEventListener("click", this.handleClick.bind(this));
      document.addEventListener("click", this.handleDocumentClick.bind(this));
    }
    toggleDropdown(isOpen) {
      gsap.to(this.languageIcon, {
        rotation: isOpen ? 180 : 0,
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(this.languageBtn, {
        backgroundColor: isOpen ? "var(--secondary--darkest)" : "var(--secondary--darker)",
        duration: 0.3
      });
      if (isOpen) {
        gsap.set(this.languageDropdown, {
          visibility: "visible",
          height: 0,
          opacity: 0
        });
        gsap.to(this.languageDropdown, {
          opacity: 1,
          height: "auto",
          duration: 0.5,
          ease: "power3.out"
        });
      } else {
        gsap.to(this.languageDropdown, {
          opacity: 0,
          height: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(this.languageDropdown, { visibility: "hidden" });
          }
        });
      }
    }
    handleMouseEnter() {
      if (!this.languageBtn.classList.contains("clicked")) {
        gsap.to(this.languageBtn, {
          width: "4.75rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
    handleMouseLeave() {
      if (!this.languageBtn.classList.contains("clicked")) {
        gsap.to(this.languageBtn, {
          width: "2rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
    handleClick() {
      const isClicked = this.languageBtn.classList.toggle("clicked");
      this.toggleDropdown(isClicked);
    }
    handleDocumentClick(event) {
      const target = event.target;
      if (!target)
        return;
      const isInside = this.languageBtn.contains(target) || this.languageDropdown.contains(target);
      const isDropdownTrigger = target.closest(
        ".btn--nav-dropdown"
      );
      if (!isInside && this.languageBtn.classList.contains("clicked") || isDropdownTrigger && !this.languageDropdown.contains(isDropdownTrigger)) {
        this.languageBtn.classList.remove("clicked");
        this.toggleDropdown(false);
        gsap.to(this.languageBtn, {
          width: "2rem",
          backgroundColor: "var(--secondary--darker)",
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  };

  // src/site.ts
  var Site = class {
    constructor() {
    }
    setup() {
      Page.loadEngineCSS("site.css");
      this.scrollBehavior = new ScrollBehavior();
      this.megaMenu = new MegaMenu();
      this.dropdownMenu = new DropdownMenu();
      this.languageSelector = new LanguageSelector();
    }
    exec() {
      this.scrollBehavior.init();
      this.megaMenu.init();
      this.dropdownMenu.init();
      this.languageSelector.init();
    }
  };
  Page.register(new Site());
})();
/*! js-cookie v3.0.5 | MIT */
//# sourceMappingURL=site.js.map
