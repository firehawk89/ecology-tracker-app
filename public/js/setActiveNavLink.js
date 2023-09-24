document.querySelectorAll(".nav-link").forEach((navLink) => {
  if (window.location.pathname.indexOf(navLink.pathname) > -1) {
    navLink.classList.add("active");
  } else {
    navLink.classList.remove("active");
  }
});
