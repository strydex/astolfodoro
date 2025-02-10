function openNav() {
  document.querySelector(".sidenav").style.left = "0";
  document.querySelector("body").style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  document.querySelector("main").style.filter = "";
  document.querySelector("header").style.filter = "";
  document.querySelector(".openbtn").style.visibility = "hidden";
}

function closeNav() {
  document.querySelector(".sidenav").style.left = "-300px";
  document.querySelector("body").style.backgroundColor = "";
  document.querySelector("main").style.filter = "";
  document.querySelector("header").style.filter = "";
  document.querySelector(".openbtn").style.visibility = "visible";
}

closeNav();