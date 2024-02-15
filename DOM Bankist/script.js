"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const nav = document.querySelector(".nav");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector(".btn--scroll-to");
const sec1 = document.getElementById("section--1");
btnScrollTo.addEventListener("click", (e) => {
  //const s1coords = sec1.getBoundingClientRect();
  // window.scrollTo(
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: "smooth",
  // });
  sec1.scrollIntoView({ behavior: "smooth" });
});

const randomInt = function (min, max) {
  return Math.floor((max - min) * Math.random() + min);
};

const randomColour = function () {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
};

function resetLinkColour() {
  document.querySelectorAll(".nav__link").forEach((link) => {
    if (!link.classList.contains("nav__link--btn")) {
      link.style.background = "#fff";
      link.style.color = "#000";
    }
  });
}

console.log(document.querySelectorAll(".nav__link"));
document.querySelectorAll(".nav__link").forEach((link) => {
  if (!link.classList.contains("nav__link--btn")) {
    link.addEventListener("click", function (e) {
      resetLinkColour();
      const colour = randomColour();
      link.style.background = colour;
      link.style.color = `rgb(${colour
        .split("(")[1]
        .split(",")
        .map((value) => {
          return 255 - value.split(")")[0];
        })})`;
      e.stopPropagation();
    });
  }
});
// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.background = randomColour();
//   e.stopPropagation();
// });
// nav.addEventListener("click", function (e) {
//   this.style.background = randomColour();
// });

nav.style.position = "fixed";
nav.style.top = 0;
nav.style.zIndex = 20;
nav.style.background = "#fff";
// exercises
// create cookie banner
const header = document.querySelector(".header");
const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  'We use cookies for improved functionalities and analytics. <button class="btn btn--close-cookie">Got it!</button>';
document.querySelector("body").prepend(message);
message.style.position = "fixed";
message.style.bottom = 0;
message.style.zIndex = 20;
const cookieBtn = document.querySelector(".btn--close-cookie");
cookieBtn.addEventListener("click", () => {
  message.remove();
  // if (header.firstChild === message) {
  //   header.append(message);
  //   message.style.background = "rgb(189 42 42)";
  // } else {
  //   header.prepend(message);
  //   message.style.background = "rgb(32 124 72)";
  // }
});

//styles
message.style.background = "#37383d";
message.style.width = "100%";
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

// for styles in the css root
//document.documentElement.style.setProperty("--color-primary", "orangered");

// Attributes
const logo = document.querySelector(".nav__logo");
