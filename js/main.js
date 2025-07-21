// Theme toggle
function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
});

// Vocabulary Loader
async function loadVocabulary() {
  const res = await fetch('data/vocabulary.json');
  const vocab = await res.json();
  const container = document.getElementById('vocab-list');
  if (!container) return;
  vocab.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<strong>${item.term}</strong>: ${item.definition}`;
    container.appendChild(div);
  });
}

// Flashcards
let flashcards = [];
let flashIndex = 0;
async function initFlashcards() {
  const res = await fetch('data/vocabulary.json');
  flashcards = await res.json();
  showFlashcard();
}

function flipCard() {
  const card = document.getElementById('flashcard');
  card.classList.toggle('flip');
}

function showFlashcard() {
  const card = document.getElementById('flashcard');
  if (!card) return;
  const front = card.querySelector('.flashcard-front');
  const back = card.querySelector('.flashcard-back');
  const item = flashcards[flashIndex];
  front.textContent = item.term;
  back.textContent = item.definition;
}

function nextCard() {
  flashIndex = (flashIndex + 1) % flashcards.length;
  showFlashcard();
}

function prevCard() {
  flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length;
  showFlashcard();
}

function shuffleCards() {
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
  flashIndex = 0;
  showFlashcard();
}

// Exam Logic
let exam = [];
let currentQuestion = 0;
let answers = [];
let timer;
let timeLeft = 3600; // 1 hour

async function startExam(examFile) {
  const res = await fetch(`data/${examFile}`);
  exam = await res.json();
  currentQuestion = 0;
  answers = [];
  timeLeft = 3600;
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('exam-screen').style.display = 'block';
  timer = setInterval(updateTimer, 1000);
  showQuestion();
}

function updateTimer() {
  timeLeft--;
  const timerEl = document.getElementById('timer');
  timerEl.textContent = `${Math.floor(timeLeft / 60)}:${('0' + timeLeft % 60).slice(-2)}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    finishExam();
  }
}

function showQuestion() {
  const q = exam[currentQuestion];
  if (!q) return;
  const questionEl = document.getElementById('question');
  questionEl.textContent = q.question;
  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(opt.charAt(0));
    optionsEl.appendChild(btn);
  });
  updateProgress();
}

function selectAnswer(letter) {
  answers[currentQuestion] = letter;
  currentQuestion++;
  if (currentQuestion >= exam.length) {
    finishExam();
  } else {
    showQuestion();
  }
}

function updateProgress() {
  const bar = document.getElementById('progress-bar');
  bar.style.width = `${((currentQuestion) / exam.length) * 100}%`;
}

function finishExam() {
  clearInterval(timer);
  document.getElementById('exam-screen').style.display = 'none';
  const resultEl = document.getElementById('result-screen');
  const list = document.getElementById('results-list');
  list.innerHTML = '';
  let score = 0;
  exam.forEach((q, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Q${i + 1}:</strong> ${q.question}<br> Your answer: ${answers[i] || 'None'} | Correct: ${q.correctAnswer}`;
    list.appendChild(li);
    if (answers[i] === q.correctAnswer) score++;
  });
  const percent = Math.round((score / exam.length) * 100);
  resultEl.querySelector('#score').textContent = `${score}/${exam.length} (${percent}%)`;
  resultEl.querySelector('#passfail').textContent = percent >= 70 ? 'Pass' : 'Fail';
  resultEl.style.display = 'block';
}
function retryExam() {
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('start-screen').style.display = 'block';
}
