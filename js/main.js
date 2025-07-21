document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vocab-list')) {
    loadVocabulary();
  }
  if (document.getElementById('flashcard')) {
    initFlashcards();
  }
});

// Vocabulary Loader with search and grouping
let vocabulary = [];
async function loadVocabulary() {
  const res = await fetch('data/vocabulary.json');
  vocabulary = await res.json();
  const search = document.getElementById('search-input');
  if (search) {
    search.addEventListener('input', () => renderVocabulary(search.value));
  }
  renderVocabulary('');
}

function renderVocabulary(filter) {
  const container = document.getElementById('vocab-list');
  if (!container) return;
  container.innerHTML = '';
  const filtered = vocabulary.filter(v => {
    const text = (v.term + ' ' + v.definition).toLowerCase();
    return text.includes(filter.toLowerCase());
  });
  const groups = {};
  filtered.forEach(v => {
    const cat = v.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(v);
  });
  Object.keys(groups).sort().forEach(cat => {
    const details = document.createElement('details');
    details.open = true;
    details.className = 'mb-4';
    const summary = document.createElement('summary');
    summary.className = 'font-semibold cursor-pointer mb-2';
    summary.textContent = cat;
    details.appendChild(summary);
    groups[cat].forEach(v => {
      const div = document.createElement('div');
      div.className = 'card mb-2';
      div.innerHTML = `<strong>${v.term}</strong>: ${v.definition}`;
      details.appendChild(div);
    });
    container.appendChild(details);
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
  if (!card) return;
  card.classList.toggle('is-flipped');
}

function showFlashcard() {
  const card = document.getElementById('flashcard');
  if (!card) return;
  card.classList.remove('is-flipped');
  const front = card.querySelector('.flashcard-front');
  const back = card.querySelector('.flashcard-back');
  const item = flashcards[flashIndex];
  front.textContent = item.term;
  back.textContent = item.definition;
  const progress = document.getElementById('flash-progress');
  if (progress) {
    progress.textContent = `Card ${flashIndex + 1} of ${flashcards.length}`;
  }
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
  const qNumEl = document.getElementById('question-number');
  if (qNumEl) {
    qNumEl.textContent = `Question ${currentQuestion + 1} of ${exam.length}`;
  }
  document.getElementById('back-btn').style.display = currentQuestion === 0 ? 'none' : 'inline-block';
  if (Array.isArray(q.correctAnswer)) {
    q.options.forEach(opt => {
      const label = document.createElement('label');
      label.className = 'mb-2 flex items-center';
      label.innerHTML = `<input type="checkbox" value="${opt.charAt(0)}" class="mr-2"> ${opt}`;
      optionsEl.appendChild(label);
    });
    const submit = document.createElement('button');
    submit.textContent = 'Submit Answer';
    submit.onclick = () => {
      const selected = [...optionsEl.querySelectorAll('input:checked')].map(i => i.value);
      selectAnswer(selected);
    };
    optionsEl.appendChild(submit);
    // pre-select previous answers
    if (Array.isArray(answers[currentQuestion])) {
      const checks = optionsEl.querySelectorAll('input[type="checkbox"]');
      checks.forEach(ch => {
        if (answers[currentQuestion].includes(ch.value)) ch.checked = true;
      });
    }
  } else {
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.onclick = () => selectAnswer(opt.charAt(0));
      if (answers[currentQuestion] === opt.charAt(0)) {
        btn.classList.add('selected-option');
      }
      optionsEl.appendChild(btn);
    });
  }
  updateProgress();
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function selectAnswer(answer) {
  answers[currentQuestion] = answer;
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
    const userAns = Array.isArray(answers[i]) ? answers[i].join(',') : (answers[i] || 'None');
    const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(',') : q.correctAnswer;
    li.innerHTML = `<strong>Q${i + 1}:</strong> ${q.question}<br> Your answer: ${userAns} | Correct: ${correctAns}`;
    list.appendChild(li);
    if (Array.isArray(q.correctAnswer)) {
      if (Array.isArray(answers[i]) && answers[i].length === q.correctAnswer.length && answers[i].every(a => q.correctAnswer.includes(a))) {
        score++;
      }
    } else {
      if (answers[i] === q.correctAnswer) score++;
    }
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
