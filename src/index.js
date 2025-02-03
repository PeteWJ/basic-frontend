import './styles/main.scss';

var utils = {
    generateID: function (base) {
      return base + Math.floor(Math.random() * 999);
    },
    focusIsInside(element) {
      return element.contains(document.activeElement);
    }
  };
  
  const icon = `<svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
                              <path fill="currentColor" d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>
                          </svg>`;
  const nav = document.getElementById("site-nav");
  nav.classList.add("enhanced");
  const navButton = document.getElementById("nav-toggle");
  const navCloseBtn = document.getElementById("nav-closeBtn");
  const navContent = document.getElementById("nav-content");
  const isDesktop = window.matchMedia("(min-width: 52em)");
  const main = document.getElementById("main");
  const footer = document.getElementById("main-footer");
  const header = document.getElementById("main-header");
  const siblings = document.querySelectorAll("header > *:not(nav)");
  
  let navIsShown = true;
  
  navCloseBtn.addEventListener(
    "click",
    function () {
      hideNav();
      navButton.focus();
    },
    false
  );
  
  function hideNav() {
    // nav.classList.add("closed");
    navButton.setAttribute("aria-expanded", "false");
    dropdowns.forEach(function (dropdown) {
      dropdown.setAttribute("hidden", "");
      let btn = dropdown.parentNode.querySelector("button");
      btn.setAttribute("aria-expanded", "false");
    });
    navIsShown = false;
    makeNavInert();
    removePageInert();
  }
  
  function makePageInert() {
    if (main) {
      main.setAttribute("inert", "");
    }
    if (footer) {
      footer.setAttribute("inert", "");
    }
  
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].setAttribute("inert", "true");
    }
  }
  
  function removePageInert() {
    if (main) {
      main.removeAttribute("inert");
    }
    if (footer) {
      footer.removeAttribute("inert");
    }
  
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].removeAttribute("inert");
    }
  }
  
  function makeNavInert() {
    navContent.setAttribute("inert", "");
  }
  
  function removeNavInert() {
    navContent.removeAttribute("inert");
  }
  
  function trapFocus(element) {
    var firstClass = "js-first-focus";
    var lastClass = "js-last-focus";
  
    var tabFocusElements =
      'button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([hidden]), video[controls]:not([hidden])';
    var focusable = element.querySelectorAll(tabFocusElements);
  
    // the first focusable element is the toggle button, but with the nav open, we don't want that one to be focused
    navCloseBtn.classList.add(firstClass);
    focusable[focusable.length - 1].classList.add(lastClass);
  
    element.addEventListener("keydown", function (e) {
      var keyCode = e.keyCode || e.which;
      var escKey = 27;
      var tabKey = 9;
  
      if (navIsShown) {
        switch (keyCode) {
          case escKey:
            hideNav();
            navButton.focus();
            break;
  
          default:
            break;
        }
  
        if (navIsShown) {
          var firstFocus = element.querySelector("." + firstClass);
          var lastFocus = element.querySelector("." + lastClass);
        }
  
        if (document.activeElement.classList.contains(lastClass)) {
          if (keyCode === tabKey && !e.shiftKey) {
            e.preventDefault();
            firstFocus.focus();
          }
        }
  
        if (document.activeElement.classList.contains(firstClass)) {
          if (keyCode === tabKey && e.shiftKey) {
            e.preventDefault();
            lastFocus.focus();
          }
        }
      }
    });
  }
  
  var top_level_items = document.querySelectorAll("li[data-has-children]");
  var dropdowns = document.querySelectorAll("li[data-has-children] > ul");
  var navID = utils.generateID("nav-");
  
  top_level_items.forEach(function (item, index) {
    const dropdown = item.querySelector(":scope > ul");
    dropdown.setAttribute("id", navID + "__ul-" + index);
    dropdown.setAttribute("hidden", "");
  
    let span = item.querySelector(":scope > span");
    if (!span) {
        return;
    }
    let text = span.innerText;
  
    let item_dw = document.createElement("button");
    item_dw.setAttribute("aria-expanded", "false");
    item_dw.setAttribute("aria-controls", navID + "__ul-" + index);
    item_dw.innerText = text;
    item_dw.innerHTML += icon;
    span.replaceWith(item_dw);
    item_dw.addEventListener("click", function (e) {
      toggleDropdown(item_dw, dropdown);
    });
  
    dropdown.addEventListener(
      "keydown",
      function (e) {
        e.stopImmediatePropagation(); // so that only the list itself closes, not its parent list (in the case of 3+ levels deep nested links)
        if (e.keyCode === 27 && utils.focusIsInside(dropdown)) {
          toggleDropdown(item_dw, dropdown);
          item_dw.focus();
        }
      },
      false
    );
  });
  
  function toggleDropdown(dw, dropdown) {
    if (dw.getAttribute("aria-expanded") === "true") {
      dw.setAttribute("aria-expanded", "false");
      dropdown.setAttribute("hidden", "");
    } else {
      dw.setAttribute("aria-expanded", "true");
      dropdown.removeAttribute("hidden");
    }
  }
  
  function collapseDropdownsWhenClickingOutsideNav(e) {
    console.log('collapseDropdownsWhenClickingOutsideNav');
    let target = e.target;
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.parentNode.contains(target)) {
        dropdown.setAttribute("hidden", "");
        let btn = dropdown.parentNode.querySelector("button");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }
  
  function collapseDropdownsWhenTabbingOutsideNav(e) {
    let target = e.target;
    if (e.keyCode === 9 && !utils.focusIsInside(nav)) {
      dropdowns.forEach(function (dropdown) {
        dropdown.setAttribute("hidden", "");
        let btn = dropdown.parentNode.querySelector("button");
        btn.setAttribute("aria-expanded", "false");
      });
    }
  }
  
  function showNavigationContent(e) {
    navButton.setAttribute("aria-expanded", "true");
    navIsShown = true;
    removeNavInert();
    makePageInert();
    trapFocus(navContent);
    navCloseBtn.focus();
  }
  
  // if user tabs out of the navigation, close all open dropdowns
  document.addEventListener("keyup", collapseDropdownsWhenTabbingOutsideNav);
  
  // if user clicks anywhere outside the navigation, close all open dropdowns
  window.addEventListener("click", collapseDropdownsWhenClickingOutsideNav);
  
  const handleResize = (e) => {
    if (e.matches) {
      // is "desktop"
      navContent.removeAttribute("hidden");
      navButton.setAttribute("hidden", "");
      navCloseBtn.setAttribute("hidden", "");
  
      navContent.removeAttribute("role");
      navContent.removeAttribute("aria-labelledby");
  
      navCloseBtn.setAttribute("hidden", "");
      removeNavInert();
      removePageInert();
    } else {
      navButton.removeAttribute("hidden");
      navCloseBtn.removeAttribute("hidden");
      navContent.setAttribute("role", "dialog");
      navContent.setAttribute("aria-labelledby", "nav-toggle");
  
      if (navIsShown) {
        makeNavInert();
      } else {
        removeNavInert();
      }
  
      navButton.addEventListener("click", showNavigationContent, false);
    }
  };
  
  isDesktop.addEventListener("change", (e) => handleResize(e));
  handleResize(isDesktop);
  

