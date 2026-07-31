/* ==========================================================
   QUIZ DATA — extracted from the uploaded exam paper
   ========================================================== */
const EXAM_TITLE = "New Friends — English Practice Exam";

const WORD_BANK = ["best", "parents", "couples", "made", "neighbour", "each", "traditional", "in", "meet", "get", "become"];

// The full "New Friends" passage, broken into text segments and blanks.
// {given:"parents"} = gap (1), already filled in as the worked example on the paper.
// {blankId:"rN"} = an editable gap, scored against QUESTIONS below.
const PASSAGE_SEGMENTS = [
  "My family recently moved to a new town and it was the beginning of the summer holidays. My (1) ",
  {given:"parents"},
  " were both busy at work and I didn't know anyone. So, I decided to join some dancing classes as I thought it might be a way to (2) ",
  {blankId:"r2"},
  " people. But when I got there, I nearly went home again as there seemed to be lots of married (3) ",
  {blankId:"r3"},
  " . Then I realised that was the class for (4) ",
  {blankId:"r4"},
  " dances and I wanted to learn modern dance. When I found the correct room, some people came to talk to me and I soon (5) ",
  {blankId:"r5"},
  " friends. After a few days, I realised that I wasn't very good at dancing. But then I never expected to (6) ",
  {blankId:"r6"},
  " a brilliant dancer. All I wanted was to (7) ",
  {blankId:"r7"},
  " to know some people. I found one girl was a (8) ",
  {blankId:"r8"},
  " who lived in the next flat to ours and we had lots of things (9) ",
  {blankId:"r9"},
  " common. She is now my (10) ",
  {blankId:"r10"},
  " friend. We see (11) ",
  {blankId:"r11"},
  " other every day. We get on well together and we never fall out. And one of my friends is now married to someone she met at that class."
];

// Question #1 (parents) is given as the worked example, so it is not quizzed.
const QUESTIONS = [
  { id:"r2",  part:"Part 1", section:"Reading", type:"bank", number:2,  gapLabel:"Gap (2)", answer:"meet" },
  { id:"r3",  part:"Part 1", section:"Reading", type:"bank", number:3,  gapLabel:"Gap (3)", answer:"couples" },
  { id:"r4",  part:"Part 1", section:"Reading", type:"bank", number:4,  gapLabel:"Gap (4)", answer:"traditional" },
  { id:"r5",  part:"Part 1", section:"Reading", type:"bank", number:5,  gapLabel:"Gap (5)", answer:"made" },
  { id:"r6",  part:"Part 1", section:"Reading", type:"bank", number:6,  gapLabel:"Gap (6)", answer:"become" },
  { id:"r7",  part:"Part 1", section:"Reading", type:"bank", number:7,  gapLabel:"Gap (7)", answer:"get" },
  { id:"r8",  part:"Part 1", section:"Reading", type:"bank", number:8,  gapLabel:"Gap (8)", answer:"neighbour" },
  { id:"r9",  part:"Part 1", section:"Reading", type:"bank", number:9,  gapLabel:"Gap (9)", answer:"in" },
  { id:"r10", part:"Part 1", section:"Reading", type:"bank", number:10, gapLabel:"Gap (10)", answer:"best" },
  { id:"r11", part:"Part 1", section:"Reading", type:"bank", number:11, gapLabel:"Gap (11)", answer:"each" },

  { id:"g1", part:"Part 2", section:"Grammar", type:"mc", number:1,
    prompt:"I saw ................. children in the park.",
    options:{a:"any", b:"some", c:"a", d:"much"}, answer:"b" },
  { id:"g2", part:"Part 2", section:"Grammar", type:"mc", number:2,
    prompt:"I was going to do the washing, but the machine ................. down.",
    options:{a:"broken", b:"break", c:"breaks", d:"broke"}, answer:"d" },
  { id:"g3", part:"Part 2", section:"Grammar", type:"mc", number:3,
    prompt:"The new bridge ................. before the end of next month.",
    options:{a:"will be completed", b:"is completed", c:"completes", d:"will complete"}, answer:"a" },
  { id:"g4", part:"Part 2", section:"Grammar", type:"mc", number:4,
    prompt:"Several trees fell down last night ................. the strong wind.",
    options:{a:"because", b:"so", c:"because of", d:"since"}, answer:"c" },
  { id:"g5", part:"Part 2", section:"Grammar", type:"mc", number:5,
    prompt:"If souvenirs weren't so expensive, I ................. many more.",
    options:{a:"may buy", b:"will buy", c:"bought", d:"would buy"}, answer:"d" },

  { id:"v1", part:"Part 3", section:"Vocabulary", type:"mc", number:1,
    prompt:"According to the weather ................. there will be rain tomorrow.",
    options:{a:"programme", b:"survey", c:"forecast", d:"information"}, answer:"c" },
  { id:"v2", part:"Part 3", section:"Vocabulary", type:"mc", number:2,
    prompt:"How much do they ................. for cleaning your room?",
    options:{a:"cost", b:"need", c:"demand", d:"charge"}, answer:"d" },
  { id:"v3", part:"Part 3", section:"Vocabulary", type:"mc", number:3,
    prompt:"The restaurant services are bad, so we should write a ................. to the manager.",
    options:{a:"complaint", b:"information", c:"message", d:"essay"}, answer:"a" },
  { id:"v4", part:"Part 3", section:"Vocabulary", type:"mc", number:4,
    prompt:"Most people in the town ................. the idea of clean and green city.",
    options:{a:"support", b:"agree", c:"believe", d:"approve"}, answer:"a" },
  { id:"v5", part:"Part 3", section:"Vocabulary", type:"mc", number:5,
    prompt:"Please confirm your reservation in ................. .",
    options:{a:"writing", b:"words", c:"letter", d:"paper"}, answer:"a" },
];

/* ==========================================================
   STATE
   ========================================================== */
let activePages = [];       // [{type:'passage', id, items:[...]}, {type:'single', id, item}]
let userAnswers = {};       // question id -> selected letter / word
let flagged = {};           // page id -> bool
let currentIndex = 0;
let timerSeconds = 0;
let timerRemaining = 0;
let timerHandle = null;

/* ==========================================================
   DOM refs
   ========================================================== */
const screens = {
  welcome: document.getElementById('screen-welcome'),
  quiz: document.getElementById('screen-quiz'),
  results: document.getElementById('screen-results'),
  review: document.getElementById('screen-review'),
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove('screen--active'));
  screens[name].classList.add('screen--active');
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
}

/* ==========================================================
   Helpers
   ========================================================== */
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function shuffleOptionsForQuestion(q){
  if(q.type !== 'mc') return q;
  const entries = Object.entries(q.options);
  const shuffledEntries = shuffle(entries);
  const letters = ['a','b','c','d'];
  const newOptions = {};
  let newAnswerLetter = q.answer;
  shuffledEntries.forEach(([origLetter, text], i) => {
    const newLetter = letters[i];
    newOptions[newLetter] = text;
    if(origLetter === q.answer) newAnswerLetter = newLetter;
  });
  return Object.assign({}, q, { options:newOptions, answer:newAnswerLetter });
}

function formatTime(sec){
  const m = Math.floor(sec/60).toString().padStart(2,'0');
  const s = Math.floor(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// Groups the flat question list into pages: one combined "passage" page
// for all Reading gaps (rendered as one continuous paragraph), and one
// page per Grammar/Vocabulary question. The passage's internal gap order
// never changes, since it has to still read as a coherent paragraph.
function buildPages(list){
  const readingItems = list.filter(q => q.section === 'Reading').slice().sort((a,b) => a.number - b.number);
  const otherItems = list.filter(q => q.section !== 'Reading');
  const pages = [];
  if(readingItems.length){
    pages.push({ type:'passage', id:'passage-page', part:'Part 1', section:'Reading', items:readingItems });
  }
  otherItems.forEach(q => pages.push({ type:'single', id:q.id, part:q.part, section:q.section, item:q }));
  return pages;
}

function flattenPages(pages){
  const out = [];
  pages.forEach(p => {
    if(p.type === 'passage') out.push(...p.items);
    else out.push(p.item);
  });
  return out;
}

function pageIsAnswered(page){
  if(page.type === 'passage'){
    return page.items.every(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== '');
  }
  return userAnswers[page.item.id] !== undefined && userAnswers[page.item.id] !== '';
}

/* ==========================================================
   START QUIZ
   ========================================================== */
document.getElementById('btn-start').addEventListener('click', () => {
  const doShuffleQ = document.getElementById('opt-shuffle-q').checked;
  const doShuffleA = document.getElementById('opt-shuffle-a').checked;
  timerSeconds = parseInt(document.getElementById('opt-timer').value, 10);

  let working = QUESTIONS.slice();
  if(doShuffleA) working = working.map(shuffleOptionsForQuestion);

  let pages = buildPages(working);
  if(doShuffleQ){
    // Shuffle the order of pages (passage page moves as a single unit —
    // its gaps inside stay in paragraph order).
    pages = shuffle(pages);
  }

  activePages = pages;
  userAnswers = {};
  flagged = {};
  currentIndex = 0;

  buildJumpGrid();
  renderPage();
  showScreen('quiz');

  if(timerSeconds > 0){
    timerRemaining = timerSeconds;
    document.getElementById('timer-display').hidden = false;
    updateTimerDisplay();
    timerHandle = setInterval(tickTimer, 1000);
  } else {
    document.getElementById('timer-display').hidden = true;
  }
});

function tickTimer(){
  timerRemaining--;
  updateTimerDisplay();
  if(timerRemaining <= 0){
    clearInterval(timerHandle);
    submitExam();
  }
}

function updateTimerDisplay(){
  const el = document.getElementById('timer-display');
  document.getElementById('timer-text').textContent = formatTime(Math.max(timerRemaining,0));
  el.classList.toggle('is-low', timerRemaining <= 30);
}

/* ==========================================================
   RENDER PAGE
   ========================================================== */
function renderPage(){
  const page = activePages[currentIndex];

  document.getElementById('progress-text').textContent = `Question ${currentIndex+1} of ${activePages.length}`;
  document.getElementById('progress-fill').style.width = `${((currentIndex+1)/activePages.length)*100}%`;

  const optionsWrap = document.getElementById('q-options');
  const passageBlock = document.getElementById('q-passage-block');
  const passageNote = document.getElementById('q-passage-note');
  const qText = document.getElementById('q-text');

  optionsWrap.innerHTML = '';
  optionsWrap.hidden = true;
  passageBlock.hidden = true;
  passageNote.hidden = true;

  if(page.type === 'passage'){
    document.getElementById('q-part-label').textContent = `${page.part} · ${page.section} (10 points)`;
    qText.textContent = 'Read the text and choose a word from the box for each gap.';
    passageBlock.hidden = false;
    renderPassageBlock(page);
  } else {
    const q = page.item;
    document.getElementById('q-part-label').textContent = `${q.part} · ${q.section}`;
    qText.textContent = q.prompt;
    optionsWrap.hidden = false;
    optionsWrap.className = 'options-list';
    Object.entries(q.options).forEach(([letter, text]) => {
      const div = document.createElement('div');
      div.className = 'option';
      if(userAnswers[q.id] === letter) div.classList.add('is-selected');
      div.innerHTML = `<span class="option-letter">${letter}</span><span class="option-text">${text}</span>`;
      div.addEventListener('click', () => {
        userAnswers[q.id] = letter;
        renderPage();
        updateJumpGrid();
      });
      optionsWrap.appendChild(div);
    });
  }

  document.getElementById('btn-prev').disabled = currentIndex === 0;
  const isLast = currentIndex === activePages.length - 1;
  document.getElementById('btn-next').hidden = isLast;
  document.getElementById('btn-submit').hidden = !isLast;

  const flagBtn = document.getElementById('btn-flag');
  flagBtn.classList.toggle('is-flagged', !!flagged[page.id]);

  updateJumpGrid();
}

function renderPassageBlock(page){
  // Reference word box, same as the box printed at the top of the paper.
  const bankEl = document.getElementById('q-wordbank-ref');
  bankEl.innerHTML = '';
  WORD_BANK.forEach(word => {
    const chip = document.createElement('span');
    chip.className = 'wordbank-chip';
    chip.dataset.word = word;
    chip.textContent = word;
    bankEl.appendChild(chip);
  });
  refreshWordBankHighlight(page);

  // The passage itself, with an inline dropdown for every editable gap.
  const textEl = document.getElementById('q-passage-text');
  textEl.innerHTML = '';
  PASSAGE_SEGMENTS.forEach(seg => {
    if(typeof seg === 'string'){
      textEl.appendChild(document.createTextNode(seg));
    } else if(seg.given){
      const strong = document.createElement('strong');
      strong.className = 'passage-given';
      strong.textContent = seg.given;
      textEl.appendChild(strong);
    } else if(seg.blankId){
      const q = page.items.find(item => item.id === seg.blankId);
      const select = document.createElement('select');
      select.className = 'passage-blank';
      select.dataset.qid = q.id;
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = `(${q.number}) …`;
      select.appendChild(placeholder);
      WORD_BANK.forEach(word => {
        const opt = document.createElement('option');
        opt.value = word;
        opt.textContent = word;
        if(userAnswers[q.id] === word) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', () => {
        userAnswers[q.id] = select.value;
        updateJumpGrid();
        refreshWordBankHighlight(page);
      });
      textEl.appendChild(select);
    }
  });
}

// Marks each word-bank chip yellow once it's been picked for any gap,
// so it's easy to see at a glance which words are already used.
function refreshWordBankHighlight(page){
  const usedWords = new Set(
    page.items
      .map(q => userAnswers[q.id])
      .filter(v => v !== undefined && v !== '')
  );
  document.querySelectorAll('.wordbank-chip').forEach(chip => {
    chip.classList.toggle('is-used', usedWords.has(chip.dataset.word));
  });
}

document.getElementById('btn-next').addEventListener('click', () => {
  if(currentIndex < activePages.length - 1){
    currentIndex++;
    renderPage();
  }
});
document.getElementById('btn-prev').addEventListener('click', () => {
  if(currentIndex > 0){
    currentIndex--;
    renderPage();
  }
});
document.getElementById('btn-flag').addEventListener('click', () => {
  const page = activePages[currentIndex];
  flagged[page.id] = !flagged[page.id];
  renderPage();
});
document.getElementById('btn-submit').addEventListener('click', submitExam);

/* ==========================================================
   JUMP GRID
   ========================================================== */
function buildJumpGrid(){
  const grid = document.getElementById('jumpgrid');
  grid.innerHTML = '';
  activePages.forEach((page, i) => {
    const dot = document.createElement('div');
    dot.className = 'jump-dot';
    dot.textContent = page.type === 'passage' ? 'P1' : (i + 1);
    dot.dataset.index = i;
    dot.addEventListener('click', () => { currentIndex = i; renderPage(); });
    grid.appendChild(dot);
  });
}
function updateJumpGrid(){
  const dots = document.querySelectorAll('.jump-dot');
  dots.forEach(dot => {
    const i = parseInt(dot.dataset.index, 10);
    const page = activePages[i];
    dot.classList.toggle('is-current', i === currentIndex);
    dot.classList.toggle('is-answered', pageIsAnswered(page));
    dot.classList.toggle('is-flagged', !!flagged[page.id]);
  });
}

/* ==========================================================
   SCORING
   ========================================================== */
function normalize(str){
  return (str || '').trim().toLowerCase();
}

function isCorrect(q){
  const given = userAnswers[q.id];
  if(given === undefined || given === null || given === '') return false;
  if(q.type === 'mc') return given === q.answer;
  return normalize(given) === normalize(q.answer);
}

function submitExam(){
  if(timerHandle) clearInterval(timerHandle);

  const allItems = flattenPages(activePages);
  const total = allItems.length;
  const correctCount = allItems.filter(isCorrect).length;
  const percent = Math.round((correctCount/total)*100);

  document.getElementById('score-percent').textContent = `${percent}%`;
  document.getElementById('score-fraction').textContent = `${correctCount} / ${total}`;

  const circumference = 2 * Math.PI * 60;
  const ring = document.getElementById('score-ring-fg');
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference;
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = circumference - (percent/100)*circumference;
  });

  let feedback, headline;
  if(percent >= 90){ feedback = "Excellent! You've really mastered this material."; headline = "Excellent!"; }
  else if(percent >= 70){ feedback = "Good job! A solid, confident performance."; headline = "Good Job!"; }
  else if(percent >= 50){ feedback = "Keep practicing — you're getting there."; headline = "Keep Practicing"; }
  else { feedback = "Review the material again and give it another go."; headline = "Review & Retry"; }

  document.getElementById('score-feedback').textContent = feedback;
  document.getElementById('result-headline').textContent = headline;

  // breakdown by section
  const bySection = {};
  allItems.forEach(q => {
    if(!bySection[q.section]) bySection[q.section] = {correct:0, total:0};
    bySection[q.section].total++;
    if(isCorrect(q)) bySection[q.section].correct++;
  });
  const breakdownEl = document.getElementById('results-breakdown');
  breakdownEl.innerHTML = '';
  Object.entries(bySection).forEach(([section, stats]) => {
    const chip = document.createElement('div');
    chip.className = 'breakdown-chip';
    chip.innerHTML = `<span class="b-part">${section}</span><span class="b-score">${stats.correct}/${stats.total}</span>`;
    breakdownEl.appendChild(chip);
  });

  showScreen('results');
}

/* ==========================================================
   REVIEW
   ========================================================== */
document.getElementById('btn-review').addEventListener('click', () => {
  renderReview();
  showScreen('review');
});
document.getElementById('btn-back-results').addEventListener('click', () => showScreen('results'));
document.getElementById('btn-retake').addEventListener('click', resetToWelcome);
document.getElementById('btn-retake-2').addEventListener('click', resetToWelcome);

function resetToWelcome(){
  showScreen('welcome');
}

function renderReview(){
  const list = document.getElementById('review-list');
  list.innerHTML = '';

  activePages.forEach(page => {
    if(page.type === 'passage'){
      list.appendChild(buildPassageReviewCard(page));
    } else {
      list.appendChild(buildSingleReviewCard(page.item));
    }
  });
}

function buildPassageReviewCard(page){
  const wrap = document.createElement('div');
  const allCorrect = page.items.every(isCorrect);
  wrap.className = `review-item ${allCorrect ? 'is-correct' : 'is-incorrect'}`;

  const tag = document.createElement('span');
  tag.className = 'review-tag';
  tag.textContent = `${page.part} · ${page.section} · full passage`;
  wrap.appendChild(tag);

  const p = document.createElement('p');
  p.className = 'review-q review-passage-text';
  PASSAGE_SEGMENTS.forEach(seg => {
    if(typeof seg === 'string'){
      p.appendChild(document.createTextNode(seg));
    } else if(seg.given){
      const strong = document.createElement('strong');
      strong.textContent = seg.given;
      p.appendChild(strong);
    } else if(seg.blankId){
      const q = page.items.find(item => item.id === seg.blankId);
      const given = userAnswers[q.id];
      const correct = isCorrect(q);
      const span = document.createElement('span');
      span.className = `passage-review-blank ${correct ? 'correct' : 'incorrect'}`;
      span.textContent = given ? given : '_____';
      span.title = correct ? 'Correct' : `Correct answer: ${q.answer}`;
      p.appendChild(span);
      if(!correct){
        const corr = document.createElement('span');
        corr.className = 'passage-review-correction';
        corr.textContent = `(${q.answer})`;
        p.appendChild(corr);
      }
    }
  });
  wrap.appendChild(p);
  return wrap;
}

function buildSingleReviewCard(q){
  const correct = isCorrect(q);
  const given = userAnswers[q.id];
  const item = document.createElement('div');
  item.className = `review-item ${correct ? 'is-correct' : 'is-incorrect'}`;

  const yourAnswerText = given ? `${given}. ${q.options[given] || ''}` : '(no answer)';
  const correctAnswerText = `${q.answer}. ${q.options[q.answer]}`;

  item.innerHTML = `
    <span class="review-tag">${q.part} · ${q.section}</span>
    <p class="review-q">${q.prompt}</p>
    <div class="review-ans-row ${correct ? 'correct' : 'incorrect'}">
      <span class="lbl">Your answer:</span>${yourAnswerText}
    </div>
    ${!correct ? `<div class="review-ans-row correct"><span class="lbl">Correct answer:</span>${correctAnswerText}</div>` : ''}
  `;
  return item;
}