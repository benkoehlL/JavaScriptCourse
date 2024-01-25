let js = 'amazing';
document.getElementById("text").innerText = "Hello World";

//variables defined with a let keyword can changed their type
let test = "Test";
document.getElementById("test_type1").innerText = "The value of the variable test is " + test + " and its type is " + typeof test;
console.log(typeof test);
test = 91;
document.getElementById("test_type2").innerText = "The value of the variable test is " + test + " and its type is " + typeof test;
console.log(typeof test);

// a const value can not be changed!!! Type error is thrown

// var is similar to let (but it should NEVER BE USED)
var job = "physicist";
job = "programmer"

const firstName = "Hans"
const lastName = "Meier"
document.getElementById("introduction").innerText = `Hello my name is ${firstName} ${lastName} and I am a ${job}. I am very happy to meet you.`;

const birthYear = 2007;
let currentYear = 2024;
const age = currentYear - birthYear;
if (age >= 16) {
    document.getElementById("drink").innerText = `${firstName} ${lastName} is allowed to drink`;
}
else {
    document.getElementById("drink").innerText = `${firstName} ${lastName} is not allowed to drink.`;
}
if (age >= 18) {
    document.getElementById("drive").innerText = `${firstName} ${lastName} is allowed to drive.`;
}
else {
    document.getElementById("drive").innerText = `${firstName} ${lastName} is not allowed to drive.`;
}

userName = prompt("What is your name?");
document.getElementById("Answer").innerText = `Hello ${userName} we are very happy to have you here ;)`;

let day = prompt("What is the current day?").toLowerCase();
console.log(day)
document.getElementById("dayActivity").innerText = `On ${day.charAt(0).toUpperCase() + day.slice(1)}, `
switch (day) {
    case 'monday':
        document.getElementById("dayActivity").innerText += " I plan my course.";
        break;
    case 'tuesday':
        document.getElementById("dayActivity").innerText += " I give my course.";
        break;
    case 'wednesday':
        document.getElementById("dayActivity").innerText += " I plan the exercises for my course.";
        break;
    case 'thursday':
        document.getElementById("dayActivity").innerText += " I give the exercises to my course.";
        break;
    case 'friday':
        document.getElementById("dayActivity").innerText += " I correct the exercises to my course.";
        break;
    case 'saturday':
    case 'sunday':
        document.getElementById("dayActivity").innerText += " I try to understand why my students did not get what I taught them.";
        break;
    default:
        document.getElementById("dayActivity").innerText += " I try to leave the twillight zone as this is not a day of the week.";
}