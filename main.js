// DATA 
async function getData() {
  const url = await fetch("https://restcountries.eu/rest/v2/all");
  const data = await url.json();

  return data;
}
getData();

// COUNTRY ITEM OBJECT
async function getCountryData() {
  const data = await getData();
  const countryData = data.map(data => {
    return {
      name: data.name,
      capital : data.capital,
      region : data.region,
      flag : data.flag 
    }
  });
  return countryData;
}

// RANDOM NUMBER
function randomNumber(min = 0, max = 250) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// DATA LIMITATION
async function randomFourCountries() {
  const countries = await getCountryData();
  const countriesArr = [];

  for ( let i = 0; i <= 3; i++) {
    const index = randomNumber();
    countriesArr.push(countries[index]);
  }
  return countriesArr;
}

//  NUMBER OF ANSWERS
const gameSumary = {
  allAnswers : 0,
  correctAnswers : 0
}

// OTHER 
const questionBox = document.querySelector(".question-box");

// NEW GAME
function newGame() {
  gameSumary.allAnswers = 0;
  gameSumary.correctAnswers = 0;
  
  displayCard();
}
newGame();

// CHECK RESULT
function checkResult() {
  if (gameSumary.allAnswers === 4 || gameSumary.correctAnswers === 4) {
    setTimeout(displayEndCard, 1000);
  } else return;
}

// RANDOM COUNTRY
function getRandomCountry(arr) {
  const index = randomNumber(0, 3);
  const random = arr[index];
  return random;
}

function cardQuestion(country) {
  const randomNr = randomNumber(1, 4);

  if (randomNr % 2 === 0) {
    return `
    <div class="question-box--header">
      <img src="${ country.flag }" alt="Country flag" class="img img-flag">
      <h2 class="quiz-question" data-title="${ country.name }"> Which country does this flag belong to? </h2>
    </div>
    `
  } else return `
    <div class="question-box--header">
      <h2 class="quiz-question" data-title="${ country.name }"> ${ country.capital } is the capital of </h2>
    </div>
  `;
}

// DISPLAY CART WITH  QUESTIONS
async function displayCard() {

  const countries = await randomFourCountries();

  const randomCountry = await getRandomCountry(countries);

  questionBox.innerHTML = "";
  questionBox.classList.remove("quiz-winner");

  const quizQuestion = cardQuestion(randomCountry);

  const answers = countries.map(answer => {
    return `
      <li class="question-list--li">
        <button class="btn btn-answer" 
          type="button" data-name="${ answer.name }">
          <span class="span span-name"> ${ answer.name } </span>
          <span class="span span-icon"> </span>
        </button>
      </li>
    `;
  }).join("");

  const questionCard = `
    <img src="./images/globe.svg" alt="globe" class="img img-globe">
    ${ quizQuestion }
    <ul class="question-list">
      ${ answers }
    </ul>
    <button class="btn btn-next disabled"> next </button>
  `;

  questionBox.innerHTML = questionCard;

  const answerBtns = document.querySelectorAll(".btn-answer");
  answerBtns.forEach(btn => btn.addEventListener("click", e => {
    checkAnswer(e, countries, answerBtns);
  }));
}

// CHECK ANSWER
async function checkAnswer(e, countries, answerBtns) {
  const target = e.target;

  const questionName = document.querySelector(".quiz-question");
  const questionData = questionName.dataset.title;
  
  const correctAnswer = target.dataset.name;
  const spanIcon = target.querySelector(".span-icon");
  const nextBtn = document.querySelector(".btn-next");

  if (correctAnswer === questionData) {
    target.classList.add("bg-green");
    spanIcon.classList.add("far", "fa-check-circle");
    ++gameSumary.allAnswers;
    ++gameSumary.correctAnswers;
  } else if (correctAnswer !== questionData) {
    target.classList.add("bg-red");
    spanIcon.classList.add("far", "fa-times-circle");
    ++gameSumary.allAnswers;
    
    // FIND CORRECT ANSWER
    const indexAnswer = countries.findIndex(({ name }) => (name === questionData));
    const btn = [...answerBtns][indexAnswer];
    btn.classList.add("bg-green");
    btn.querySelector(".span-icon").classList.add("far", "fa-check-circle");
  }

  answerBtns.forEach(btn => btn.setAttribute("disabled", "true"));
  checkResult();

  nextBtn.classList.remove("disabled");
  nextBtn.addEventListener("click", displayCard);
}

// DISPLAY END CARD
function displayEndCard() {

  questionBox.innerHTML = "";
  questionBox.classList.add("quiz-winner");

  const endCard = `
    <img src="./images/winners.svg" alt="gold trophy" class="img img-trophy">
    <h2 class="result-title">Results</h2>
    <h4 class="result-desc"> You got <span class="span span-result"> ${ gameSumary.correctAnswers } </span> correct answers</h4>
    <button class="btn btn-again">Try again</button>
  `;
 
  questionBox.innerHTML = endCard;
  document.querySelector(".btn-again").addEventListener("click", newGame);
}