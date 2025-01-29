// Navigation Module
// Combines all navigation-related components

import { MegaMenu } from './mega-menu';
import { HideNav } from './hide-nav-on-scroll';
import { DropdownMenu } from './dropdown-menu';
import { LanguageSelector } from './language-selector';

export class Navigation {
    private megaMenu: MegaMenu;
    private hideNav: HideNav;
    private dropdownMenu: DropdownMenu;
    private languageSelector: LanguageSelector;

    constructor() {
        // Initialize all navigation components
        this.megaMenu = new MegaMenu();
        this.hideNav = new HideNav();
        this.dropdownMenu = new DropdownMenu();
        this.languageSelector = new LanguageSelector();
    }
} 