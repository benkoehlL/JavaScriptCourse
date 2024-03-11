"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////
function renderError(message) {
  countriesContainer.insertAdjacentText("beforeend", message);
}

function throwError(response, message) {
  if (!response.ok) throw new Error(message);
}

function getJSON(url, errorMessage) {
  return fetch(url).then((response) => {
    throwError(response, `Country not found! (${response.status})`);
    return response.json();
  });
}

function renderCountry(data, className = "") {
  const html = `
      <article class="country ${className}">
        <img class="country__img" src="${data.flags["svg"]}" />
        <div class="country__data">
          <h3 class="country__name">${data.name["common"]}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}M people</p>
          <p class="country__row"><span>🗣️</span>${
            data.languages[Object.getOwnPropertyNames(data.languages)[0]]
          }</p>
          <p class="country__row"><span>💰</span>${
            Object.getOwnPropertyNames(data.currencies)[0]
          }</p>
        </div>
      </article>
      `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
}

const getCountryData = function (country) {
  getJSON(`https:/restcountries.com/v3.1/name/${country}`)
    .then((data) => {
      renderCountry(data[0]);
      console.log(Boolean(data[0]?.borders));
      const neighbours = data[0]?.borders;
      if (!neighbours) {
        throw new Error("No neighbour found");
      }
      return getJSON(
        `https:/restcountries.com/v3.1/alpha/${neighbours.slice(-1)}`
      );
    })
    .then((data) => {
      renderCountry(data[0], "neighbour");
    })
    .catch((err) => {
      renderError(`An error occured: ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

getCountryData("ukraine");
