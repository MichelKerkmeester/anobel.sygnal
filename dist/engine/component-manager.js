"use strict";
(() => {
  // src/engine/component-manager.ts
  var ComponentManager = class {
    constructor() {
      this.components = /* @__PURE__ */ new Map();
    }
    registerComponent(type, component) {
      var _a;
      if (!this.components.has(type)) {
        this.components.set(type, []);
      }
      (_a = this.components.get(type)) == null ? void 0 : _a.push(component);
    }
    getComponentsByType(type) {
      return this.components.get(type) || [];
    }
  };
})();
//# sourceMappingURL=component-manager.js.map
