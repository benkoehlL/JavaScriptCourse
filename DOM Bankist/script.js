"use strict";

// initialise variables
let currentSlide;

// select elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const nav = document.querySelector(".nav");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const imageTargets = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const allSection = document.querySelectorAll(".section");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
const sec1 = document.getElementById("section--1");
const sec2 = document.getElementById("section--2");
const sec3 = document.getElementById("section--3");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const header = document.querySelector(".header");
const message = document.createElement("div");
message.innerHTML =
  'We use cookies for improved functionalities and analytics. <button class="btn btn--close-cookie">Got it!</button>';
message.classList.add("cookie-message");
document.querySelector("body").prepend(message);
const cookieBtn = document.querySelector(".btn--close-cookie");

// functions
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const randomInt = function (min, max) {
  return Math.floor((max - min) * Math.random() + min);
};

const randomColour = function () {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
};

function resetLinkColour(link) {
  link.style.background = "#fff";
  link.style.color = "#000";
}

function resetLinksColour() {
  document.querySelectorAll(".nav__link").forEach((link) => {
    if (!link.classList.contains("nav__link--btn")) {
      resetLinkColour(link);
    }
  });
}

function setLinkColour(link) {
  const colour = randomColour();
  link.style.background = colour;
  link.style.color = `rgb(${colour
    .split("(")[1]
    .split(",")
    .map((value) => {
      return 255 - value.split(")")[0];
    })})`;
}

// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const other = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    other.forEach((el) => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
      logo.style.opacity = opacity;
    });
  }
};

// slider functions
function displayNewSlide(s) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - s) * 100}%)`;
  });
}

function slideRight() {
  currentSlide = (currentSlide + 1) % slides.length;
  displayNewSlide(currentSlide);
  selectActiveSlide(currentSlide);
}

function slideLeft() {
  if (currentSlide === 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = currentSlide - 1;
  }
  displayNewSlide(currentSlide);
  selectActiveSlide(currentSlide);
}

// reveal section when scrolling
const revealSection = function (entries, observer) {
  const [entry] = entries;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

// lazy loading images
const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

function createDots() {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide=${index}></button>`
    );
  });
  selectActiveSlide(currentSlide);
}

function selectActiveSlide(slide) {
  [...dotContainer.children].forEach(function (e) {
    e.classList.remove("dots__dot--active");
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
}

// event listeners
//modal
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Page navigation
// document.querySelectorAll(".nav__link").forEach((link) => {
//   if (!link.classList.contains("nav__link--btn")) {
//     document.addEventListener("scroll", (e) => {
//       const associatedSection = document.querySelector(
//         link.getAttribute("href")
//       );
//       const coordinateY = associatedSection.getBoundingClientRect().top;

//       if (coordinateY < 0) {
//         document.querySelectorAll(".nav__link").forEach((el) => {
//           resetLinksColour();
//           setLinkColour(link);
//         });
//       } else {
//         resetLinkColour(link);
//       }
//     });
//   }
// });

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

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

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

document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();
  if (
    e.target.classList.contains("nav__link") &&
    !e.target.classList.contains("nav__link--btn")
  ) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    resetLinksColour();
    setLinkColour(e.target);
    e.stopPropagation();
  }
});

dotContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    displayNewSlide(slide);
    selectActiveSlide(slide);
  }
});

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.background = randomColour();
//   e.stopPropagation();
// });
// nav.addEventListener("click", function (e) {
//   this.style.background = randomColour();
// });

//

// tabbed components
tabsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".operations__tab");

  //guard clause
  if (!clicked) return;

  [...clicked.parentElement.children].forEach((item) => {
    item.classList.remove("operations__tab--active");
  });
  clicked.classList.add("operations__tab--active");
  tabsContent.forEach((t) => t.classList.remove("operations__content--active"));
  document
    .querySelector(`.operations__content--${clicked.getAttribute("data-tab")}`)
    .classList.add("operations__content--active");
});

nav.addEventListener("mouseover", (e) => {
  handleHover(e, 0.25);
});

nav.addEventListener("mouseout", (e) => {
  handleHover(e, 1);
});

btnRight.addEventListener("click", () => {
  slideRight();
});

btnLeft.addEventListener("click", () => {
  slideLeft();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    slideRight();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    slideLeft();
  }
});
// sticky navigation (bad way)
// window.addEventListener("scroll", () => {
//   if (sec1.getBoundingClientRect().top < window.scrollY) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// sticky navigation (intersection observer API)
const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    nav.querySelectorAll(".nav__link").forEach((link) => {
      if (!link.classList.contains("nav__link--btn")) {
        if (
          link.getAttribute("href").slice(1) === entry.target.getAttribute("id")
        ) {
          if (entry.isIntersecting) {
            resetLinksColour();
            setLinkColour(link);
          } else {
            resetLinkColour(link);
          }
        }
      }
    });
  });
};

const obsOptions = {
  root: null,
  threshold: [0],
  rootMargin: `-${nav.offsetHeight}px`,
};

const navObserver = new IntersectionObserver(obsCallback, obsOptions);

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: `-200px`,
});
imageTargets.forEach((img) => imageObserver.observe(img));

const init = function () {
  // initialisation
  nav.style.position = "fixed";
  nav.style.top = 0;
  nav.style.zIndex = 20;
  nav.style.background = "#fff";

  // create cookie banner
  message.style.position = "fixed";
  message.style.bottom = 0;
  message.style.zIndex = 20;
  message.style.background = "#37383d";
  message.style.width = "100%";
  message.style.height =
    Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

  // initialise the slider
  currentSlide = 0;
  displayNewSlide(currentSlide);

  // create dots
  createDots();

  allSection.forEach(function (section) {
    navObserver.observe(section);
    sectionObserver.observe(section);
    section.classList.add("section--hidden");
  });
};

init();

// displying a messages when user tries to close the page
// DO NOT ABUSE THIS
// use only when data is lost should the window be closed
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
});
// exercises

//styles

// for styles in the css root
//document.documentElement.style.setProperty("--color-primary", "orangered");

// Attributes
const logo = document.querySelector(".nav__logo");
