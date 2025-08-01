/* THIS JS WAS COMPILED AND OPTIMIZED, USING THE WP COMPILER PLUGIN */
/* https://bytes.co */
/* Last Compiled: 2023-03-14 11:12:34 UTC */

/* @@ START FILE: comments.js*/
jQuery(document).ready(function($) {
    var form_validation = $(".comment-form-url input, .comment-form-author input, .comment-form-email input, .comment-form-comment textarea");
    $(form_validation).blur(function() {
        if (!$(this).val()) {
            $(this).parent().removeClass("keystone-not-empty");
        } else {
            $(this).parent().addClass("keystone-not-empty");
        }
    });
    var contact_form = $(".keystone-label input, .keystone-label textarea");
    $(contact_form).blur(function() {
        if (!$(this).val()) {
            $(this).closest(".keystone-label").removeClass("keystone-not-empty");
        } else {
            $(this).closest(".keystone-label").addClass("keystone-not-empty");
        }
    });

});
/* @@ END FILE: comments.js*/

;

/* @@ START FILE: navigation.js*/
/**
 * @Author: Roni Laukkarinen
 * @Date:   2021-04-23 13:10:51
 * @Last Modified by:   Roni Laukkarinen
 * @Last Modified time: 2022-05-12 15:10:04
 */
// TODO: Refactor file
/* eslint-disable default-case, camelcase, eqeqeq, no-restricted-globals, no-undef, no-var, vars-on-top, max-len, prefer-destructuring, no-redeclare, no-plusplus, no-use-before-define, no-unused-vars, block-scoped-var, func-names */
/*
An accessible menu for WordPress

https://github.com/theme-smith/accessible-nav-wp
Kirsten Smith (kirsten@themesmith.co.uk)
Licensed GPL v.2 (http://www.gnu.org/licenses/gpl-2.0.html)

This work derived from:
https://github.com/WordPress/twentysixteen (GPL v.2)
https://github.com/wpaccessibility/a11ythemepatterns/tree/master/menu-keyboard-arrow-nav (GPL v.2)
*/

/*!
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 * @source https://gomakethings.com/how-to-check-if-any-part-of-an-element-is-out-of-the-viewport-with-vanilla-js/
 */
var isOutOfViewport = function(elem) {
    // Get element's bounding
    var bounding = elem.getBoundingClientRect();

    // Check if it's out of the viewport on each side
    var out = {};
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;

    return out;
};

// Navigation.js start
(function($) {
    // Responsive nav width
    var responsivenav = 1025;
    var html;
    var body;
    var container;
    var button;
    var menu;
    var menuWrapper;
    var links;
    var subMenus;
    var i;
    var len;
    var focusableElements;
    var firstFocusableElement;
    var lastFocusableElement;

    // Hover intent
    const menuItems = document.querySelectorAll('.menu-item');
    // const hoverIntentTimeout = 1000;

    menuItems.forEach((li) => {
        li.addEventListener('mouseover', function() {
            this.classList.add('hover-intent');
            this.parentNode.classList.add('hover-intent');

            document.addEventListener('keydown', (keydownMouseoverEvent) => {
                if (keydownMouseoverEvent.key === 'Escape') {
                    li.classList.remove('hover-intent');
                    li.parentNode.classList.remove('hover-intent');
                    li.parentNode.parentNode.classList.remove('hover-intent');
                }
            });
        });

        li.addEventListener('mouseleave', function() {
            // setTimeout(() => {
            this.classList.remove('hover-intent');
            this.parentNode.classList.remove('hover-intent');
            // }, hoverIntentTimeout);

            document.addEventListener('keydown', (keydownMouseleaveEvent) => {
                if (keydownMouseleaveEvent.key === 'Escape') {
                    li.classList.remove('hover-intent');
                    li.parentNode.classList.remove('hover-intent');
                    li.parentNode.parentNode.classList.remove('hover-intent');
                }
            });
        });
    });

    // Init isOut check
    checkForSubmenuOverflow();

    function checkForSubmenuOverflow() {
        menuItems.forEach((li) => {
            // Find sub menus
            var subMenusUnderMenuItem = li.querySelectorAll('.sub-menu');

            // Loop through sub menus
            subMenusUnderMenuItem.forEach((subMenu) => {
                // First let's check if submenu exists
                if (typeof subMenusUnderMenuItem !== 'undefined') {
                    // Check if the sub menu is out of viewport or not
                    var isOut = isOutOfViewport(subMenu);

                    // At least one side of the element is out of viewport
                    if (isOut.right) {
                        subMenu.classList.add('is-out-of-viewport');
                        subMenu.parentElement.parentElement.classList.add('is-out-of-viewport');
                    } else {
                        subMenu.classList.remove('is-out-of-viewport');
                        subMenu.parentElement.parentElement.classList.remove('is-out-of-viewport');
                    }
                }
            });
        });
    }

    // Reinit viewport check on resize event
    window.addEventListener('resize', checkForSubmenuOverflow);

    // Define menu items
    var menuContainer = $('.nav-container');
    var menuToggle = menuContainer.find('#nav-toggle');
    var siteHeaderMenu = menuContainer.find('#main-navigation-wrapper');
    var siteNavigation = menuContainer.find('#nav');

    var screenReaderText = { "expand": "Expand child menu", "collapse": "Collapse child menu" };

    // Close focused dropdowns when pressing esc
    $('.menu-item a, .dropdown button').on('keyup', function(e) {
        // Checking are menu items open or not
        const isSubMenuDropdownOpen = $(this).parent().parent().parent()
            .find('.sub-menu')
            .prev('.dropdown-toggle')
            .attr('aria-expanded');
        const isMainMenuDropdownOpen = $(this).closest('.menu-item').find('.dropdown-toggle').attr('aria-expanded');
        const areWeInDropdown = $(this).parent().parent().hasClass('sub-menu');

        if (isSubMenuDropdownOpen === 'true' || isMainMenuDropdownOpen === 'true') {
            if ($('.dropdown').find(':focus').length !== 0) {
                // Close menu using Esc key but only if dropdown is open
                if (e.code === 'Escape') {
                    // Close the dropdown menu
                    var thisDropdown = $(this).parent().parent().parent();

                    var screenReaderSpan = thisDropdown.find('.screen-reader-text');
                    var dropdownToggle = thisDropdown.find('.dropdown-toggle');
                    thisDropdown.find('.sub-menu').removeClass('toggled-on');
                    thisDropdown.find('.dropdown-toggle').removeClass('toggled-on');
                    thisDropdown.find('.dropdown').removeClass('toggled-on');
                    dropdownToggle.attr('aria-expanded', 'false');
                    // jscs:enable
                    screenReaderSpan.text(screenReaderText.expand);
                    // Move focus back to previous dropdown select
                    // But only if we are not already in the toggle of the first dropdown menu
                    if (areWeInDropdown === true) {
                        thisDropdown.find('.dropdown-toggle:first').trigger('focus');
                    }
                }
            }
        }

        if (window.innerWidth > responsivenav) {
            // Close previous dropdown if we are on main level
            var prevDropdown = $(this).parent().prev();

            var screenReaderSpanPrev = prevDropdown.find('.screen-reader-text');
            var dropdownTogglePrev = prevDropdown.find('.dropdown-toggle');
            prevDropdown.find('.sub-menu').removeClass('toggled-on');
            prevDropdown.find('.dropdown-toggle').removeClass('toggled-on');
            prevDropdown.find('.dropdown').removeClass('toggled-on');
            dropdownTogglePrev.attr('aria-expanded', 'false');
            screenReaderSpanPrev.text(screenReaderText.expand);

            // Close next dropdown if we are on main level
            var nextDropdown = $(this).parent().next();

            var screenReaderSpanNext = nextDropdown.find('.screen-reader-text');
            var dropdownToggleNext = nextDropdown.find('.dropdown-toggle');
            nextDropdown.find('.sub-menu').removeClass('toggled-on');
            nextDropdown.find('.dropdown-toggle').removeClass('toggled-on');
            nextDropdown.find('.dropdown').removeClass('toggled-on');
            dropdownToggleNext.attr('aria-expanded', 'false');
            screenReaderSpanNext.text(screenReaderText.expand);
        }
    });

    // Adds aria attribute
    siteHeaderMenu.find('.menu-item-has-children').attr('aria-haspopup', 'true');

    // Add default dropdown-toggle label
    $('.dropdown-toggle').each(function() {
        $(this).attr('aria-label', `${screenReaderText.expand_for} ${$(this).prev().text()}`);
    });

    // Toggles the sub-menu when dropdown toggle button accessed
    siteHeaderMenu.find('.dropdown-toggle').on('click', function(e) {
        var dropdownMenu = $(this).nextAll('.sub-menu');

        $(this).toggleClass('toggled-on');
        dropdownMenu.toggleClass('toggled-on');

        // jscs:disable
        $(this).attr(
            'aria-expanded',
            $(this).attr('aria-expanded') === 'false' ? 'true' : 'false',
        );
        // jscs:enable
        // Change screen reader open/close labels

        $(this).attr(
            'aria-label',
            $(this).attr('aria-label') === `${screenReaderText.collapse_for} ${$(this).prev().text()}` ?
            `${screenReaderText.expand_for} ${$(this).prev().text()}` :
            `${screenReaderText.collapse_for} ${$(this).prev().text()}`,
        );
    });

    // Adds a class to sub-menus for styling
    $('.sub-menu .menu-item-has-children')
        .parent('.sub-menu')
        .addClass('has-sub-menu');

    // Keyboard navigation
    $('.menu-item a, button.dropdown-toggle').on('keydown', function(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) == -1) {
            return;
        }

        switch (e.code) {
            case 'ArrowLeft': // Left key
                e.stopPropagation();

                if ($(this).hasClass('dropdown-toggle')) {
                    $(this).prev('a').trigger('focus');
                } else if (
                    $(this).parent().prev().children('button.dropdown-toggle').length
                ) {
                    $(this).parent().prev().children('button.dropdown-toggle')
                        .trigger('focus');
                } else {
                    $(this).parent().prev().children('a')
                        .trigger('focus');
                }

                if ($(this).is('ul ul ul.sub-menu.toggled-on li:first-child a')) {
                    $(this)
                        .parents('ul.sub-menu.toggled-on li')
                        .children('button.dropdown-toggle')
                        .trigger('focus');
                }

                break;

            case 'ArrowRight': // Right key
                e.stopPropagation();

                if ($(this).next('button.dropdown-toggle').length) {
                    $(this).next('button.dropdown-toggle').trigger('focus');
                } else if ($(this).parent().next().find('input').length) {
                    $(this).parent().next().find('input')
                        .trigger('focus');
                } else {
                    $(this).parent().next().children('a')
                        .trigger('focus');
                }

                if ($(this).is('ul.sub-menu .dropdown-toggle.toggled-on')) {
                    $(this).parent().find('ul.sub-menu li:first-child a').trigger('focus');
                }

                break;

            case 'ArrowDown': // Down key
                e.stopPropagation();

                if ($(this).next().length) {
                    $(this).next().find('li:first-child a').first()
                        .trigger('focus');
                } else if ($(this).parent().next().find('input').length) {
                    $(this).parent().next().find('input')
                        .trigger('focus');
                } else {
                    $(this).parent().next().children('a')
                        .trigger('focus');
                }

                if (
                    $(this).is('ul.sub-menu a') &&
                    $(this).next('button.dropdown-toggle').length
                ) {
                    $(this).parent().next().children('a')
                        .trigger('focus');
                }

                if (
                    $(this).is('ul.sub-menu .dropdown-toggle') &&
                    $(this).parent().next().children('.dropdown-toggle').length
                ) {
                    $(this).parent().next().children('.dropdown-toggle')
                        .trigger('focus');
                }

                break;

            case 'ArrowUp': // Up key
                e.stopPropagation();

                if ($(this).parent().prev().length) {
                    $(this).parent().prev().children('a')
                        .trigger('focus');
                } else {
                    $(this)
                        .parents('ul')
                        .first()
                        .prev('.dropdown-toggle.toggled-on')
                        .trigger('focus');
                }

                if (
                    $(this).is('ul.sub-menu .dropdown-toggle') &&
                    $(this).parent().prev().children('.dropdown-toggle').length
                ) {
                    $(this).parent().prev().children('.dropdown-toggle')
                        .trigger('focus');
                }

                break;
        }
    });

    container = document.getElementById('nav');
    if (!container) {
        return;
    }

    button = document.getElementById('nav-toggle');
    if (typeof button === 'undefined') {
        return;
    }

    // Set vars.
    html = document.getElementsByTagName('html')[0];
    body = document.getElementsByTagName('body')[0];
    menu = container.getElementsByTagName('ul')[0];
    menuWrapper = document.getElementById('main-navigation-wrapper');

    function mobileNav() {
        var mobileNavInstance;

        // Toggles the menu button
        if (!menuToggle.length) {
            return;
        }

        // Do not set aria-expanded false on desktop
        if (window.innerWidth < responsivenav) {
            menuToggle.add(siteNavigation).attr('aria-expanded', 'false');
        }

        menuToggle.on('click', function() {
            $(this).add(siteHeaderMenu).toggleClass('toggled-on');

            // Change screen reader expanded state
            $(this).attr(
                'aria-expanded',
                $(this).attr('aria-expanded') === 'false' ? 'true' : 'false',
            );

            // Change screen reader open/close labels
            $('#nav-toggle-label').text(
                // eslint-disable-next-line no-undef
                $('#nav-toggle-label').text() === screenReaderText.expand_toggle ?
                screenReaderText.collapse_toggle :
                screenReaderText.expand_toggle,
            );

            $(this).attr(
                'aria-label',
                $(this).attr('aria-label') === screenReaderText.expand_toggle ?
                screenReaderText.collapse_toggle :
                screenReaderText.expand_toggle,
            );

            // jscs:disable
            $(this)
                .add(siteNavigation)
                .attr(
                    'aria-expanded',
                    $(this).add(siteNavigation).attr('aria-expanded') === 'false' ?
                    'true' :
                    'false',
                );

            // Scroll to top when triggering mobile navigation
            // to ensure no gaps are between header and navigation
            // Please note, if you use sticky-nav, comment out the next line
            window.scrollTo(0, 0);
            // jscs:enable
        });

        // Hide menu toggle button if menu is empty and return early.
        if (typeof menu === 'undefined') {
            button.style.display = 'none';
            return;
        }

        // Do not set aria-expanded false on desktop
        if (window.innerWidth < responsivenav) {
            menu.setAttribute('aria-expanded', 'false');
        }

        if (menu.className.indexOf('nav-menu') === -1) {
            menu.className += ' nav-menu';
        }

        // Focus trap for mobile navigation
        if (window.innerWidth < responsivenav) {
            firstFocusableElement = null;
            lastFocusableElement = null;

            // Select nav items
            var navElements = container.querySelectorAll([
                '.nav-primary a[href]',
                '.nav-primary button',
            ]);

            // Listen for key events on nav elements and the toggle button
            // to trigger focus trap
            for (var ii = 0; ii < navElements.length; ii++) {
                navElements[ii].addEventListener('keydown', focusTrap);
            }
        }

        // What happens when clicking menu toggle
        button.onclick = function() {
            if (container.className.indexOf('is-active') !== -1) {
                closeMenu(); // Close menu.
            } else {
                html.className += ' disable-scroll';
                body.className += ' js-nav-active';
                container.className += ' is-active';
                button.className += ' is-active';
                button.setAttribute('aria-expanded', 'true');
                menu.setAttribute('aria-expanded', 'true');

                // Add focus trap when menu open
                button.addEventListener('keydown', focusTrap, false);
            }
        };

        // Close menu using Esc key.
        document.addEventListener('keyup', (event) => {
            if (event.code == 'Escape' || event.code == 'Esc') {
                if (container.className.indexOf('is-active') !== -1) {
                    closeMenu(); // Close menu.
                }
            }
        });

        // Close menu clicking menu wrapper area.
        menuWrapper.onclick = function(e) {
            if (
                e.target == menuWrapper &&
                container.className.indexOf('is-active') !== -1
            ) {
                closeMenu(); // Close menu.
            }
        };
    }
    if (window.innerWidth < responsivenav) {
        mobileNav(); // fire right away for mobile devices
    }

    // Close menu function.
    function closeMenu() {
        button.removeEventListener('keydown', focusTrap, false);
        html.className = html.className.replace(' disable-scroll', '');
        body.className = body.className.replace(' js-nav-active', '');
        container.className = container.className.replace(' is-active', '');
        button.className = button.className.replace(' is-active', '');
        button.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-expanded', 'false');
        $('#nav-toggle-label').text(screenReaderText.expand_toggle);

        // Return focus to nav-toggle
        button.focus();
    }

    // Get all the link elements within the menu.
    links = menu.getElementsByTagName('a');
    subMenus = menu.getElementsByTagName('ul');

    // Each time a menu link is focused or blurred, toggle focus.
    for (i = 0, len = links.length; i < len; i++) {
        links[i].addEventListener('focus', toggleFocus, true);
        links[i].addEventListener('blur', toggleFocus, true);
    }

    /**
     * Sets or removes .focus class on an element.
     */
    function toggleFocus() {
        var self = this;

        // Move up through the ancestors of the current link until we hit .nav-menu.
        while (self.className.indexOf('nav-menu') === -1) {
            // On li elements toggle the class .focus.
            if (self.tagName.toLowerCase() === 'li') {
                if (self.className.indexOf('focus') !== -1) {
                    self.className = self.className.replace(' focus', '');
                } else {
                    self.className += ' focus';
                }
            }

            self = self.parentElement;
        }
    }

    function focusTrap(e) {
        // Set focusable elements inside main navigation.
        focusableElements = [...container.querySelectorAll(
            'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
        )].filter((el) => !el.hasAttribute('disabled')).filter((el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));

        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];

        // Redirect last Tab to first focusable element.
        if (lastFocusableElement === e.target && e.code === 'Tab' && !e.shiftKey) {
            button.focus(); // Set focus on first element - that's actually close menu button.
        }

        // Redirect first Shift+Tab to toggle button element.
        if (firstFocusableElement === e.target && e.code === 'Tab' && e.shiftKey) {
            button.focus(); // Set focus on last element.
        }

        // Redirect Shift+Tab from the toggle button to last focusable element.
        if (button === e.target && e.code === 'Tab' && e.shiftKey) {
            lastFocusableElement.focus(); // Set focus on last element.
        }
    }

    $(window).on('resize', () => {
        if (window.innerWidth > responsivenav && body.className.indexOf('js-nav-active') !== -1) {
            closeMenu(); // Close menu.
        } else if (window.innerWidth < responsivenav && typeof window.mobileNavInstance == 'undefined') {
            mobileNav();
        }
    });
}(jQuery));

/* @@ END FILE: navigation.js*/