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

  // src/components/Navigation.ts
  var Navigation = class {
    constructor() {
      this.lastScrollTop = 0;
      this.navbar = null;
      this.scrollThreshold = 50;
      this.mobileBreakpoint = 768;
    }
    init() {
      this.navbar = document.querySelector(".nav--bar");
      this.initScrollBehavior();
      this.initMegaMenu();
      this.initDropdowns();
      this.initLanguageSelector();
    }
    initScrollBehavior() {
      if (this.navbar) {
        this.navbar.style.transition = "transform 0.3s ease-in-out";
      }
      window.addEventListener("scroll", this.handleScroll.bind(this), {
        passive: true
      });
    }
    initMegaMenu() {
      const megaMenu = document.querySelector(".nav--mega-menu");
      const menuButton = document.querySelector(".btn--hamburger");
      const lottieAnimation = lottie.loadAnimation({
        container: document.querySelector(".lottie--hamburger"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "https://cdn.prod.website-files.com/6723d26a4aa4a278cad8f59c/6777ecd6636dc4314d954783_Icon%20-%20Hamburger%20Menu.json"
      });
      function openMenu() {
        if (!megaMenu)
          return;
        megaMenu.style.display = "flex";
        gsap.to(megaMenu, {
          duration: 0.8,
          height: "100svh",
          width: "100%",
          ease: "power2.out",
          delay: 0.2,
          onComplete: () => {
            megaMenu.style.borderRadius = "0rem";
          }
        });
        lottieAnimation.playSegments([0, 70], true);
      }
      function closeMenu() {
        if (!megaMenu)
          return;
        megaMenu.style.borderRadius = "1rem";
        gsap.to(megaMenu, {
          duration: 0.4,
          height: "0svh",
          width: "100%",
          ease: "power2.in",
          onComplete: () => {
            megaMenu.style.display = "none";
          }
        });
        lottieAnimation.removeEventListener("complete");
        lottieAnimation.playSegments([70, 140], true);
        lottieAnimation.addEventListener("complete", () => {
          lottieAnimation.goToAndStop(0, true);
          lottieAnimation.removeEventListener("complete");
        });
      }
      let isOpen = false;
      if (menuButton) {
        menuButton.addEventListener("click", () => {
          if (!isOpen) {
            openMenu();
          } else {
            closeMenu();
          }
          isOpen = !isOpen;
        });
      }
    }
    initDropdowns() {
      const dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));
      if (!dropdowns.length) {
        console.error("No dropdown elements found in the DOM!");
      } else {
        const navigation = document.querySelector(".nav--bar");
        if (!navigation) {
          console.error("Navigation container (.navigation) not found!");
        } else {
          const dropdownData = dropdowns.map((dropdown) => {
            const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
            const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
            const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");
            if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
              console.warn(
                "Some required elements (dropdownToggle, dropdownMenu, dropdownIcon) are missing in a .nav--dropdown!"
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
          const createOpenTimeline = (d) => {
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
            ).to(
              d.icon,
              { rotation: 180, duration: 0.3, ease: "power2.out" },
              "<"
            ).to(
              d.toggle,
              { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
              "<"
            );
            if (isDesktop) {
              tl.to(
                navigation,
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
          };
          const createCloseTimeline = (d) => {
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
                navigation,
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
          };
          const closeAllDropdowns = (except = null) => {
            dropdownData.forEach((d) => {
              if (d !== except && d.isOpen && !d.animating) {
                closeDropdown(d);
              }
            });
          };
          const openDropdown = (d) => {
            createOpenTimeline(d).play();
            d.isOpen = true;
          };
          const closeDropdown = (d) => {
            createCloseTimeline(d).play();
            d.isOpen = false;
          };
          dropdownData.forEach((d) => {
            if (!d)
              return;
            d.toggle.addEventListener("click", () => {
              if (d.animating)
                return;
              if (d.isOpen) {
                closeDropdown(d);
              } else {
                closeAllDropdowns(d);
                openDropdown(d);
              }
            });
          });
          document.addEventListener("click", (e) => {
            dropdownData.forEach((d) => {
              if (d.isOpen && !d.animating) {
                const clickedInside = d.dropdown.contains(e.target) || d.toggle.contains(e.target);
                if (!clickedInside) {
                  closeDropdown(d);
                }
              }
            });
          });
          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              closeAllDropdowns();
            }
          });
        }
      }
    }
    initLanguageSelector() {
      const languageBtn = document.querySelector('[class*="language--btn-w"]');
      const languageDropdown = document.querySelector(
        '[class*="language--dropdown-w"]'
      );
      const languageIcon = document.querySelector(".icon--svg.is--language");
      if (!languageBtn || !languageDropdown || !languageIcon) {
        console.error("Required elements not found!");
      } else {
        const toggleDropdown = (isOpen) => {
          gsap.to(languageIcon, {
            rotation: isOpen ? 180 : 0,
            duration: 0.4,
            ease: "power2.out"
          });
          gsap.to(languageBtn, {
            backgroundColor: isOpen ? "var(--secondary--darkest)" : "var(--secondary--darker)",
            duration: 0.3
          });
          if (isOpen) {
            gsap.set(languageDropdown, {
              visibility: "visible",
              height: 0,
              opacity: 0
            });
            gsap.to(languageDropdown, {
              opacity: 1,
              height: "auto",
              duration: 0.5,
              ease: "power3.out"
            });
          } else {
            gsap.to(languageDropdown, {
              opacity: 0,
              height: 0,
              duration: 0.5,
              ease: "power3.in",
              onComplete: () => {
                gsap.set(languageDropdown, { visibility: "hidden" });
              }
            });
          }
        };
        languageBtn.addEventListener("mouseenter", () => {
          if (!languageBtn.classList.contains("clicked")) {
            gsap.to(languageBtn, {
              width: "4.75rem",
              backgroundColor: "var(--secondary--darker)",
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
        languageBtn.addEventListener("mouseleave", () => {
          if (!languageBtn.classList.contains("clicked")) {
            gsap.to(languageBtn, {
              width: "2rem",
              backgroundColor: "var(--secondary--darker)",
              duration: 0.3,
              ease: "power2.in"
            });
          }
        });
        languageBtn.addEventListener("click", () => {
          const isClicked = languageBtn.classList.toggle("clicked");
          toggleDropdown(isClicked);
        });
        document.addEventListener("click", (event) => {
          const target = event.target;
          if (!target)
            return;
          const isInside = languageBtn.contains(target) || languageDropdown.contains(target);
          const isDropdownTrigger = target.closest(
            ".btn--nav-dropdown"
          );
          if (!isInside && languageBtn.classList.contains("clicked") || isDropdownTrigger && !languageDropdown.contains(isDropdownTrigger)) {
            languageBtn.classList.remove("clicked");
            toggleDropdown(false);
            gsap.to(languageBtn, {
              width: "2rem",
              backgroundColor: "var(--secondary--darker)",
              duration: 0.3,
              ease: "power2.in"
            });
          }
        });
      }
    }
    handleScroll() {
      if (window.innerWidth <= this.mobileBreakpoint)
        return;
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (Math.abs(this.lastScrollTop - currentScroll) <= this.scrollThreshold)
        return;
      if (currentScroll > this.lastScrollTop && currentScroll > 50) {
        if (this.navbar) {
          this.navbar.style.transform = "translateY(-200%)";
        }
      } else {
        if (this.navbar) {
          this.navbar.style.transform = "translateY(0)";
        }
      }
      this.lastScrollTop = currentScroll;
    }
  };

  // src/site.ts
  var Site = class {
    constructor() {
    }
    setup() {
      Page.loadEngineCSS("site.css");
      console.log("Site setup called");
    }
    exec() {
      console.log("Site exec called");
      this.navigation = new Navigation();
      this.navigation.init();
    }
  };
  Page.register(new Site());
})();
/*! js-cookie v3.0.5 | MIT */
//# sourceMappingURL=site.js.map
