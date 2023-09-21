const navbarLinks = document.querySelectorAll(".nav-link");
const pageUrlPathName = window.location.pathname;

navbarLinks.forEach((navbarLink) => {
  if (navbarLink.href.indexOf(pageUrlPathName) !== -1) {
    navbarLink.classList.add("active");
    navbarLink.setAttribute("aria-current", "page");
  }
});
