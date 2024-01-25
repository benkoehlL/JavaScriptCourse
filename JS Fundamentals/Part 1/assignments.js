let country = "Germany";
let continent = "Europe";
let population = "about 84 Million";

document.getElementById("text_assignment").innerText = "I am living in " + country + " which is a country in " + continent + " and has a population of " + population;

const massMark = 78;
const massJohn = 92;
const heightMark = 1.69;
const heightJohn = 1.95;
const BMIMark = massMark / (heightMark * heightMark);
const BMIJohn = massJohn / (heightJohn * heightJohn);
console.log(BMIMark, BMIJohn);
const markHigherBMI = BMIMark > BMIJohn;
console.log(markHigherBMI);
let text = `The BMI of Mark is ${BMIMark} and the BMI of John is ${BMIJohn}.\n`;
if (markHigherBMI) {
    text += "Therefore, Mark has an higher BMI.";
}
else {
    text += "Therefore, John has an higher BMI.";
}
document.getElementById("firstCodingTest").innerText = text;