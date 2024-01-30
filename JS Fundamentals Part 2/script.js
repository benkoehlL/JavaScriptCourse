'use strict';
function logger() {
    console.log("My name is Jonas");
}

// calling / running  / invoking the function
logger();
logger();

function fruitProcessor(apples, oranges) {
    console.log(`number of apples: ${apples}\n number of oranges: ${oranges}`);
    const juice = `Make a juice out of ${apples} apples and ${oranges} oranges.`;
    return juice;
}

const appleJuice = console.log(fruitProcessor(5, 0));
const orangeJuice = console.log(fruitProcessor(0, 5));
const appleOrangeJuice = console.log(fruitProcessor(0, 5));
console.log(appleJuice, '\n', orangeJuice, '\n', appleOrangeJuice);

// can be called before declaration
// function declaration
function calcAge1(birthYear) {
    return (2037 - birthYear);
}

// not be called before declaration
// function expression
const calcAge2 = function (birthYear) {
    return (2037 - birthYear);
}

// arrow function
const calcAge3 = birthYear => 2037 - birthYear;
const age1 = calcAge1(1990);
const age2 = calcAge2(1990);
const age3 = calcAge3(1990);

console.log(age1, age2, age3);

const yearsUntilRetirement = (birthYear, firstName) => {
    const age = 2024 - birthYear;
    const retirement = 65 - age;
    return `${firstName} retires in ${retirement} years.`;
}

function calculateRetirement() {
    document.getElementById("retirement").innerText = yearsUntilRetirement(prompt("When were you born?"), prompt("What is your name?"));
}

// how to make Arrays
const friends = ["Dina", "Peter", "Christoph"];
const years = new Array(1990, 1984, 2001);

// accessing arrays and getting their length
console.log(friends[0], friends[2], years[1]);
console.log(friends.length, friends[friends.length - 1]);

friends[2] = 'Jane';
console.log(friends);

const benjamin = ["Benjamin", 30, true, friends];
console.log(benjamin);

const ages = [calcAge1(years[0]), calcAge2(years[1]), calcAge3(years[2])];
console.log(ages);

// add element at last place
const newLength = friends.push("Hans");
console.log(friends, newLength);

// add element to first place
friends.unshift("Jürgen")
console.log(friends);

// remove last element
const poped = friends.pop()
console.log(friends, poped);

// remove first element
friends.shift()
console.log(friends, poped);

// get position of certain array
console.log(friends.indexOf("Peter"), friends.indexOf("Benjamin"))

// check whether element is in array
console.log(friends.includes("Peter"), friends.includes("Benjamin"))

// objects
const benjaminObject = {
    firstName: "Benjamin",
    lastName: "Köhler",
    birthYear: 1990,
    job: "physicist",
    friends: ["Dina", "Sam", "Ilya", "Christoph"],
    hasDriversLicence: true,
    age: function () {
        return new Date().getFullYear() - this.birthYear;
    },
    summary: function () {
        return `My name is ${this['first' + nameKey]} ${this['last' + nameKey]}. 
        I work as a ${this.job} and was born in the year ${this.birthYear}, so I am ${this.age()} years old. 
        Currently, I am living in ${this.address}, ${this.location}. 
        I have ${this.friends.length} friends. Their names are ${this.friends}.
        I have ${this.hasDriversLicence ? 'a' : 'no'} drivers licence.`
    }
};

console.log(benjaminObject.firstName);
benjaminObject.location = "Germany";
benjaminObject['address'] = "Werner Heisenberg Avenue 42";
const nameKey = "Name";
document.getElementById("introduction").innerText = benjaminObject.summary();

/* Write your code below. Good luck! 🙂 */
const mark = {
    fullName: "Mark Miller",
    mass: 78,
    height: 1.69,
    calcBMI: function () {
        this.bmi = this.mass / (this.height * this.height);
        return this.bmi;
    }
};

const john = {
    fullName: "John Smith",
    mass: 92,
    height: 1.95,
    calcBMI: function () {
        this.bmi = this.mass / (this.height * this.height);
        return this.bmi;
    }
}
document.getElementById("assignment").innerText = `${john.calcBMI() > mark.calcBMI() ? john.fullName + "'s BMI (" + john.bmi + ")" : mark.fullName + "'s BMI (" + mark.bmi + ")"} is greater than ${john.bmi < mark.bmi ? john.fullName + "'s (" + john.bmi + ")" : mark.fullName + "'s (" + mark.bmi + ")"}`;

// for loop
for (let rep = 1; rep <= 10; rep++) {
    console.log(`Lifting weights repetition ${rep}.`);
}

// looping through arrays
for (let i = 0; i < benjaminObject.friends.length; i++) {
    console.log(`Benjamin's ${i + 1}. friend is ${benjaminObject.friends[i]}.`);
}

// while loop
let rep = 1;
while (rep <= 10) {
    console.log(`Lifting penguin repetition ${rep}.`);
    rep++;
}

// do loop
rep = 1;
do {
    console.log(`Lifting forks repetition ${rep}.`);
    rep++;
} while (rep <= 10);