'use strict';
// DATA
const getData = async () => {
  const URL = 'https://restcountries.com/v3.1/all';
  // const URL = 'https://restcountries.eu/rest/v2/all';

  try {
    const response = await fetch(`${URL}`);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Http: error: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
  }
};
getData();

// COUNTRY ITEM OBJECT
const getCountryData = async () => {
  const data = await getData();

  const countryData = data.map((item) => {
    return {
      name: item.name,
      capital: item.capital,
      region: item.region,
      flag: item.flags.svg,
    };
  });

  return countryData;
};

// RANDOM NUMBER
const getRandomNumber = (min = 0, max = 250) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomFourCountriesIndex = () => {
  const randomIndexArray = [];

  for (let i = 0; i <= 3; i++) {
    randomIndexArray.push(getRandomNumber());
  }

  checkRandomArray(randomIndexArray);
  return randomIndexArray;
};

// CHECK INDEX IN ARRAY FOR REPEATED NUMBER
const checkRandomArray = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return getRandomFourCountriesIndex();
    }
  }
};

// RANDOM FOUR COUNTRIES FOR QUESTIONS
const getRandomFourCountries = async () => {
  const countries = await getCountryData();
  const indexes = getRandomFourCountriesIndex();
  const countriesArr = [];

  for (let i = 0; i < indexes.length; i++) {
    countriesArr.push(countries[indexes[i]]);
  }

  // console.log(countriesArr);
  return countriesArr;
};

//  NUMBER OF ANSWERS
const gameSumary = {
  allAnswers: 0,
  correctAnswers: 0,
};

// OTHER
const questionBox = document.querySelector('.question-box');

// CHECK RESULT
const checkResult = () => {
  if (gameSumary.allAnswers === 4 || gameSumary.correctAnswers === 4) {
    setTimeout(displayEndCard, 1000);
  } else return;
};

// RANDOM COUNTRY
const getRandomCountry = (arr) => {
  const randomCountry = arr[getRandomNumber(0, 3)];
  return randomCountry;
};

const cardQuestion = (country) => {
  const randomNr = getRandomNumber();

  const template =
    randomNr % 2 === 0
      ? `<div class="question-box--header">
        <img src="${country.flag}" alt="Country flag - ${country.name.official}" class="img img-flag">
        <h2 class="quiz-question" data-title="${country.name.official}"> Which country does this flag belong to? </h2>
      </div>
      `
      : ` <div class="question-box--header">
        <h2 class="quiz-question" data-title="${country.name.official}"> ${country.capital[0]} is the capital of: </h2>
      </div>
    `;
  return template;
};

// DISPLAY CART WITH  QUESTIONS
const displayQuestionCard = async () => {
  const countries = await getRandomFourCountries();

  const randomCountry = await getRandomCountry(countries);

  questionBox.innerHTML = '';
  questionBox.classList.contains('quiz-winner')
    ? questionBox.classList.remove('quiz-winner')
    : '';

  const quizQuestion = cardQuestion(randomCountry);

  const answersTemplate = `
    <ul class="question-list">
      ${countries
        .map(
          (answer) => `
          <li class="question-list--li">
            <button 
              class="btn btn-answer" 
              type="button" 
              data-name="${answer.name.official}">
              <span class="span span-name"> ${answer.name.official} </span>
              <span class="span span-icon"> </span>
            </button>
          </li>
        `,
        )
        .join('')}
    </ul>
  `;

  const questionCard = `
    <img src="./src/images/globe.svg" alt="globe" class="img img-globe" />
    ${quizQuestion}
    ${answersTemplate}
    <button class="btn btn-next disabled"> next </button>
  `;

  questionBox.innerHTML = questionCard;

  const answerBtns = document.querySelectorAll('.btn-answer');

  answerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      checkAnswer(e, countries, answerBtns);
    });
  });
};

// CHECK ANSWER
const checkAnswer = (e, countries, answerBtns) => {
  const target = e.target;

  const questionName = document.querySelector('.quiz-question');
  const questionData = questionName.dataset.title;

  const correctAnswer = target.dataset.name;
  const spanIcon = target.querySelector('.span-icon');
  const nextBtn = document.querySelector('.btn-next');

  if (correctAnswer === questionData) {
    target.classList.add('bg-green');
    spanIcon.classList.add('far', 'fa-check-circle');
    ++gameSumary.allAnswers;
    ++gameSumary.correctAnswers;
  } else if (correctAnswer !== questionData) {
    target.classList.add('bg-red');
    spanIcon.classList.add('far', 'fa-times-circle');
    ++gameSumary.allAnswers;

    // FIND CORRECT ANSWER
    const indexAnswer = countries.findIndex(
      (item) => item.name.official === questionData,
    );

    const btn = [...answerBtns][indexAnswer];
    btn.classList.add('bg-green');
    btn.querySelector('.span-icon').classList.add('far', 'fa-check-circle');
  }

  answerBtns.forEach((btn) => btn.setAttribute('disabled', 'true'));
  checkResult();

  gameSumary.allAnswers === 4 || gameSumary.correctAnswers === 4
    ? ''
    : nextBtn.classList.remove('disabled');

  nextBtn.addEventListener('click', displayQuestionCard);
};

// DISPLAY END CARD
const displayEndCard = () => {
  questionBox.innerHTML = '';
  questionBox.classList.add('quiz-winner');

  const endCard = `
    <img src="./src/images/winners.svg" alt="gold trophy" class="img img-trophy">
    <h2 class="result-title"> Results </h2>
    <h4 class="result-desc"> You got <span class="span span-result"> ${gameSumary.correctAnswers} </span> correct answers</h4>
    <button class="btn btn-again"> Try again </button>
  `;

  questionBox.innerHTML = endCard;
  document.querySelector('.btn-again').addEventListener('click', newGame);
};

// NEW GAME
const newGame = () => {
  gameSumary.allAnswers = 0;
  gameSumary.correctAnswers = 0;

  displayQuestionCard();
};
newGame();
