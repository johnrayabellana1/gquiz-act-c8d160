const quiz = [
  { q: "The book is ___ the table.", o: ["on", "in", "at", "under"], a: 0 },
  { q: "She is waiting ___ the bus stop.", o: ["on", "at", "in", "over"], a: 1 },
  { q: "The cat is hiding ___ the bed.", o: ["on", "at", "under", "above"], a: 2 },
  { q: "He arrived ___ the airport early.", o: ["in", "on", "at", "by"], a: 2 },
  { q: "We live ___ the Philippines.", o: ["at", "on", "in", "to"], a: 2 },
  { q: "The picture is ___ the wall.", o: ["on", "in", "under", "beside"], a: 0 },
  { q: "She sat ___ me.", o: ["between", "among", "beside", "under"], a: 2 },
  { q: "He walked ___ the room.", o: ["into", "on", "at", "above"], a: 0 },
  { q: "The keys are ___ my bag.", o: ["on", "in", "at", "by"], a: 1 },
  { q: "The ball rolled ___ the chair.", o: ["under", "on", "in", "at"], a: 0 }
];

let index = 0;
let score = 0;
let answers = [];

const quizArea = document.getElementById("quizArea");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion() {
  nextBtn.style.display = "none";
  quizArea.innerHTML = `
    <div class="question">${quiz[index].q}</div>
    ${quiz[index].o.map((opt, i) => `
      <div class="option" onclick="selectAnswer(${i})">
        <span>${String.fromCharCode(65 + i)}.</span> ${opt}
      </div>`).join("")}
  `;
}

function selectAnswer(choice) {
  const options = document.querySelectorAll(".option");
  options.forEach(opt => opt.style.pointerEvents = "none");

  if (choice === quiz[index].a) {
    options[choice].classList.add("correct");
    score++;
    answers.push(true);
  } else {
    options[choice].classList.add("wrong");
    options[quiz[index].a].classList.add("correct");
    answers.push(false);
  }
  nextBtn.style.display = "inline-block";
}

function nextQuestion() {
  index++;
  if (index < quiz.length) loadQuestion();
  else showResult();
}

function showResult() {
  quizArea.innerHTML = `
    <div class="result">
      <h2>Your Score: ${score} / ${quiz.length}</h2>
      ${quiz.map((q, i) => `
        <div class="review">
          ${i + 1}. ${q.q}<br>
          Correct Answer: <b>${q.o[q.a]}</b>
          ${answers[i] ? " ✅" : " ❌"}
        </div>
      `).join("")}
    </div>
  `;
  nextBtn.style.display = "none";
}

loadQuestion();