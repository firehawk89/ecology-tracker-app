document.querySelectorAll(".nav-link").forEach((navLink) => {
  if (navLink.pathname === window.location.pathname) {
    navLink.classList.add("active");
  } else {
    navLink.classList.remove("active");
  }
});
