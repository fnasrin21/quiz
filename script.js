let Questions = [];
const ques = document.getElementById("ques");

// Timer
let timeLeft = 60; 
const timerElement = document.getElementById("timer");
const timer = setInterval(function () {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        alert('Time is up!');
        endQuiz(); 
    }
}, 1000);

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error(`Something went wrong!! Unable to fetch the data`);
        }
        const data = await response.json();
        Questions = data.results;
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5 style='color: red'>${error.message}</h5>`;
    }
}

fetchQuestions();

let currQuestion = 0;
let score = 0;

function loadQues() {
    if (Questions.length === 0) {
        ques.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
        return;
    }
    const opt = document.getElementById("opt");
    let currentQuestion = Questions[currQuestion].question;

    currentQuestion = currentQuestion.replace(/&quot;/g, '"').replace(/&#039;/g, "'");

    ques.innerText = currentQuestion;

    opt.innerHTML = ""; // Clear previous options
    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;

    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5); 

    options.forEach((option) => {
        option = option.replace(/&quot;/g, '"').replace(/&#039;/g, "'");

        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;

        choiceLabel.textContent = option;

        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });
}

setTimeout(() => {
    if (Questions.length > 0) {
        loadQues();
    } else {
        ques.innerHTML = `<h5 style='color: red'>Unable to fetch data, Please try again!!</h5>`;
    }
}, 2000);

function loadScore() {
    const totalScore = document.getElementById("score");
    totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
    totalScore.innerHTML += "<h3>All Answers</h3>";
    Questions.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
    });
}

function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        endQuiz();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (selectedAns && selectedAns.value === Questions[currQuestion].correct_answer) {
        score++;
    }
    nextQuestion();
}

function endQuiz() {
    clearInterval(timer); // Stop the timer
    document.getElementById("opt").remove();
    document.getElementById("ques").remove();
    document.getElementById("btn").remove();
    loadScore(); // Display the score
}

