// --- Groq LLM Emoji Sentiment ---
async function sendGroqEmojiSentiment() {
  const input = document.getElementById('groq-emoji-input');
  const emoji = input.value.trim();
  if (!emoji) return;
  const resultDiv = document.getElementById('groq-emoji-result');
  resultDiv.innerHTML = '';
  document.getElementById('groq-emoji-loading').style.display = '';
  try {
    const resp = await fetch('/api/groq_emoji_sentiment/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({emoji: emoji})
    });
    if (!resp.ok) throw new Error('Network error');
    const data = await resp.json();
    resultDiv.innerHTML = `<div class='border rounded p-2 bg-light ai-md-box'>${escapeHtml(data.response)}</div>`;
  } catch (e) {
    resultDiv.innerHTML = `<div class='text-danger'>Error: ${escapeHtml(e.message)}</div>`;
  } finally {
    document.getElementById('groq-emoji-loading').style.display = 'none';
  }
}
// --- AI Tic-Tac-Toe ---
let tttBoard, tttPlayer, tttGameOver;
function startTicTacToe() {
  tttBoard = Array(9).fill('');
  tttPlayer = 'X';
  tttGameOver = false;
  drawTicTacToe();
  document.getElementById('ttt-status').innerText = "Your turn! (X)";
}
function drawTicTacToe() {
  const boardDiv = document.getElementById('ttt-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'border d-flex align-items-center justify-content-center';
    cell.style.width = '60px';
    cell.style.height = '60px';
    cell.style.fontSize = '2rem';
    cell.style.cursor = tttGameOver || tttBoard[i] ? 'not-allowed' : 'pointer';
    cell.innerText = tttBoard[i];
    cell.onclick = () => tttMove(i);
    boardDiv.appendChild(cell);
  }
}
function tttMove(i) {
  if (tttGameOver || tttBoard[i]) return;
  tttBoard[i] = tttPlayer;
  drawTicTacToe();
  if (tttCheckWin(tttBoard, tttPlayer)) {
    document.getElementById('ttt-status').innerText = 'You win!';
    tttGameOver = true;
    return;
  }
  if (tttBoard.every(x=>x)) {
    document.getElementById('ttt-status').innerText = 'Draw!';
    tttGameOver = true;
    return;
  }
  document.getElementById('ttt-status').innerText = "AI's turn...";
  setTimeout(()=>{
    const aiMove = tttBestMove(tttBoard, 'O');
    tttBoard[aiMove] = 'O';
    drawTicTacToe();
    if (tttCheckWin(tttBoard, 'O')) {
      document.getElementById('ttt-status').innerText = 'AI wins!';
      tttGameOver = true;
      return;
    }
    if (tttBoard.every(x=>x)) {
      document.getElementById('ttt-status').innerText = 'Draw!';
      tttGameOver = true;
      return;
    }
    document.getElementById('ttt-status').innerText = "Your turn! (X)";
  }, 500);
}
function tttCheckWin(b, p) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(line => line.every(i => b[i] === p));
}
function tttBestMove(board, player) {
  let bestScore = -Infinity, move = 0;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = player;
      let score = tttMinimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) { bestScore = score; move = i; }
    }
  }
  return move;
}
function tttMinimax(board, depth, isMax) {
  if (tttCheckWin(board, 'O')) return 10 - depth;
  if (tttCheckWin(board, 'X')) return depth - 10;
  if (board.every(x=>x)) return 0;
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, tttMinimax(board, depth+1, false));
        board[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, tttMinimax(board, depth+1, true));
        board[i] = '';
      }
    }
    return best;
  }
}
if (document.getElementById('ttt-board')) startTicTacToe();

// --- AI Chatbot ---
const chatbotReplies = [
  {q:/hello|hi|hey/i, a:"Hello! How can I help you today?"},
  {q:/name|who are you/i, a:"I'm an AI bot for Prathamesh's portfolio!"},
  {q:/project|work/i, a:"Check out the Projects page to see my work!"},
  {q:/ai|machine learning|ml/i, a:"I love talking about AI and ML!"},
  {q:/bye|goodbye/i, a:"Goodbye! Have a great day!"},
];
function sendChatbotMsg() {
  const input = document.getElementById('chatbot-input');
  const msg = input.value.trim();
  if (!msg) return;
  const chatDiv = document.getElementById('chatbot-messages');
  chatDiv.innerHTML += `<div><b>You:</b> ${msg}</div>`;
  let reply = "I'm not sure how to answer that.";
  for (const r of chatbotReplies) if (r.q.test(msg)) { reply = r.a; break; }
  setTimeout(()=>{
    chatDiv.innerHTML += `<div><b>AI:</b> ${reply}</div>`;
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }, 500);
  input.value = '';
}

// --- AI Number Guessing Game ---
// --- Modern AI Number Guessing Game ---
let ngLow = 1, ngHigh = 100, ngTries = 0, ngCurrent = null, ngHistory = [];
function startNumberGame() {
  ngLow = 1; ngHigh = 100; ngTries = 0; ngHistory = [];
  document.getElementById('number-game-area').style.display = '';
  document.getElementById('number-game-result').innerHTML = '';
  document.getElementById('number-game-history').innerHTML = '';
  numberGameAsk();
}
function numberGameAsk() {
  ngCurrent = Math.floor((ngLow + ngHigh) / 2);
  ngTries++;
  const qDiv = document.getElementById('number-game-question');
  qDiv.innerHTML = `<span class='fs-4 fw-bold text-primary'>🤖 Is your number <span class='text-warning'>${ngCurrent}</span>?</span>`;
  ngHistory.push(ngCurrent);
  updateNumberGameHistory();
}
function numberGameRespond(resp) {
  if (resp === 'higher') ngLow = ngCurrent + 1;
  else if (resp === 'lower') ngHigh = ngCurrent - 1;
  else if (resp === 'correct') {
    document.getElementById('number-game-result').innerHTML = `<div class='alert alert-success mt-2'><b>🎉 AI guessed it in ${ngTries} tries!</b></div>`;
    document.getElementById('number-game-area').style.display = 'none';
    confettiEffect('number-game-result');
    return;
  }
  if (ngLow > ngHigh) {
    document.getElementById('number-game-result').innerHTML = `<div class='alert alert-danger mt-2'>😕 <b>Something went wrong! Try again.</b></div>`;
    document.getElementById('number-game-area').style.display = 'none';
    return;
  }
  numberGameAsk();
}
function updateNumberGameHistory() {
  const histDiv = document.getElementById('number-game-history');
  if (!histDiv) return;
  histDiv.innerHTML = ngHistory.map((n,i) => `<span class='badge bg-info text-dark me-1 mb-1'>${n}</span>`).join(' ');
}

// --- Modern Rock-Paper-Scissors vs AI ---
function playRPS(user) {
  const choices = ['rock', 'paper', 'scissors'];
  const icons = {rock:'✊', paper:'✋', scissors:'✌️'};
  const ai = choices[Math.floor(Math.random()*3)];
  let result = '', color = '', emoji = '';
  if (user === ai) { result = `Draw!`; color = 'secondary'; emoji = '🤝'; }
  else if ((user==='rock'&&ai==='scissors')||(user==='paper'&&ai==='rock')||(user==='scissors'&&ai==='paper')) { result = `You win!`; color = 'success'; emoji = '🏆'; }
  else { result = `AI wins!`; color = 'danger'; emoji = '🤖'; }
  document.getElementById('rps-result').innerHTML = `
    <div class='d-flex align-items-center gap-2'>
      <span class='fs-3'>You: <b>${icons[user]}</b></span>
      <span class='fs-3'>AI: <b>${icons[ai]}</b></span>
      <span class='fs-3'>${emoji}</span>
    </div>
    <div class='alert alert-${color} mt-2 mb-0 text-center fw-bold'>${result}</div>
  `;
  animateRPSResult(color);
}
function animateRPSResult(color) {
  const el = document.getElementById('rps-result');
  el.style.transition = 'box-shadow 0.3s';
  el.style.boxShadow = `0 0 16px 2px var(--bs-${color})`;
  setTimeout(()=>{ el.style.boxShadow = ''; }, 600);
}

// --- Modern Emoji Sentiment Game ---
function guessEmojiSentiment() {
  const emoji = document.getElementById('emoji-input').value.trim();
  let mood = '🤔 Not sure!'; let color = 'secondary';
  if ('😀😃😄😁😆😊🙂😍🥳😺'.includes(emoji)) { mood = '😃 Happy!'; color = 'success'; }
  else if ('😢😭☹️🙁😞😔😿'.includes(emoji)) { mood = '😢 Sad.'; color = 'info'; }
  else if ('😡😠🤬'.includes(emoji)) { mood = '😡 Angry!'; color = 'danger'; }
  else if ('😱😨😰😧'.includes(emoji)) { mood = '😱 Scared!'; color = 'warning'; }
  else if ('😎🤓🧐'.includes(emoji)) { mood = '😎 Cool!'; color = 'primary'; }
  document.getElementById('emoji-result').innerHTML = `<div class='alert alert-${color} fw-bold'>${mood}</div>`;
  animateEmojiResult(color);
}
function animateEmojiResult(color) {
  const el = document.getElementById('emoji-result');
  el.style.transition = 'box-shadow 0.3s';
  el.style.boxShadow = `0 0 16px 2px var(--bs-${color})`;
  setTimeout(()=>{ el.style.boxShadow = ''; }, 600);
}

// --- Confetti Effect for Win ---
function confettiEffect(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const colors = ['#FFD700','#FF69B4','#00CFFF','#7CFC00','#FF6347'];
  for (let i=0; i<24; i++) {
    const conf = document.createElement('span');
    conf.innerText = '🎉';
    conf.style.position = 'absolute';
    conf.style.left = (10 + Math.random()*80) + '%';
    conf.style.top = (10 + Math.random()*40) + '%';
    conf.style.fontSize = (18+Math.random()*18)+'px';
    conf.style.pointerEvents = 'none';
    conf.style.opacity = '0.85';
    conf.style.transition = 'all 1.2s';
    conf.style.color = colors[Math.floor(Math.random()*colors.length)];
    el.appendChild(conf);
    setTimeout(()=>{
      conf.style.top = (60+Math.random()*20)+'%';
      conf.style.opacity = '0';
    }, 50);
    setTimeout(()=>{ el.removeChild(conf); }, 1400);
  }
}

// --- Rock-Paper-Scissors vs AI ---
function playRPS(user) {
  const choices = ['rock', 'paper', 'scissors'];
  const ai = choices[Math.floor(Math.random()*3)];
  let result = '';
  if (user === ai) result = `Draw! Both chose ${ai}.`;
  else if ((user==='rock'&&ai==='scissors')||(user==='paper'&&ai==='rock')||(user==='scissors'&&ai==='paper')) result = `You win! AI chose ${ai}.`;
  else result = `AI wins! AI chose ${ai}.`;
  document.getElementById('rps-result').innerText = result;
}

// --- Emoji Sentiment Game ---
function guessEmojiSentiment() {
  const emoji = document.getElementById('emoji-input').value.trim();
  let mood = '🤔 Not sure!';
  if ('😀😃😄😁😆😊🙂😍🥳😺'.includes(emoji)) mood = 'Happy!';
  else if ('😢😭☹️🙁😞😔😿'.includes(emoji)) mood = 'Sad.';
  else if ('😡😠🤬'.includes(emoji)) mood = 'Angry!';
  else if ('😱😨😰😧'.includes(emoji)) mood = 'Scared!';
  else if ('😎🤓🧐'.includes(emoji)) mood = 'Cool!';
  document.getElementById('emoji-result').innerText = `AI thinks you are: ${mood}`;
}

// --- Quick Math Quiz (AI) ---
let mqA = 0, mqB = 0, mqScore = 0, mqCount = 0;
function startMathQuiz() {
  mqScore = 0; mqCount = 0;
  document.getElementById('math-quiz-area').style.display = '';
  document.getElementById('math-quiz-result').innerText = '';
  nextMathQuizQ();
}
function nextMathQuizQ() {
  mqA = Math.floor(Math.random()*20)+1;
  mqB = Math.floor(Math.random()*20)+1;
  document.getElementById('math-quiz-question').innerText = `What is ${mqA} + ${mqB}?`;
  document.getElementById('math-quiz-answer').value = '';
}
function submitMathQuizAnswer() {
  const ans = parseInt(document.getElementById('math-quiz-answer').value);
  if (ans === mqA + mqB) {
    mqScore++;
    document.getElementById('math-quiz-result').innerText = 'Correct!';
  } else {
    document.getElementById('math-quiz-result').innerText = `Wrong! The answer was ${mqA + mqB}.`;
  }
  mqCount++;
  if (mqCount < 5) setTimeout(nextMathQuizQ, 1000);
  else setTimeout(()=>{
    document.getElementById('math-quiz-area').style.display = 'none';
    document.getElementById('math-quiz-result').innerText = `Quiz Over! Your score: ${mqScore}/5`;
  }, 1200);
}


// --- Markdown/Code rendering helper ---
function renderMarkdown(md) {
  if (!window.marked) return escapeHtml(md);
  return marked.parse(md || '', { breaks: true });
}

function addCopyButton(targetDiv, text) {
  const btn = document.createElement('button');
  btn.className = 'btn btn-sm btn-outline-secondary ms-2';
  btn.innerText = 'Copy';
  btn.onclick = () => { navigator.clipboard.writeText(text); btn.innerText = 'Copied!'; setTimeout(()=>btn.innerText='Copy', 1200); };
  targetDiv.appendChild(btn);
}

// --- Groq LLM Chat Playground ---
async function sendGroqChat() {
  const input = document.getElementById('groq-chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const chatDiv = document.getElementById('groq-chat-messages');
  chatDiv.innerHTML += `<div class='mb-1'><b>You:</b> ${escapeHtml(msg)}</div>`;
  chatDiv.scrollTop = chatDiv.scrollHeight;
  input.value = '';
  document.getElementById('groq-chat-loading').style.display = '';
  try {
    const resp = await fetch('/api/groq_chat/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: msg})
    });
    if (!resp.ok) throw new Error('Network error');
    const data = await resp.json();
    const aiDiv = document.createElement('div');
    aiDiv.className = 'mb-2';
    aiDiv.innerHTML = `<b>AI:</b> <div class='ai-md-box'>${renderMarkdown(data.response)}</div>`;
    chatDiv.appendChild(aiDiv);
    addCopyButton(aiDiv, data.response);
    chatDiv.scrollTop = chatDiv.scrollHeight;
    if (window.hljs) { aiDiv.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block)); }
  } catch (e) {
    chatDiv.innerHTML += `<div class='text-danger'><b>AI:</b> Error: ${escapeHtml(e.message)}</div>`;
    chatDiv.scrollTop = chatDiv.scrollHeight;
  } finally {
    document.getElementById('groq-chat-loading').style.display = 'none';
  }
}

// --- Groq Story/Poem Generator ---
async function sendGroqStory() {
  const input = document.getElementById('groq-story-input');
  const prompt = input.value.trim();
  if (!prompt) return;
  const resultDiv = document.getElementById('groq-story-result');
  resultDiv.innerHTML = '';
  document.getElementById('groq-story-loading').style.display = '';
  try {
    const resp = await fetch('/api/groq_story/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({prompt: prompt})
    });
    if (!resp.ok) throw new Error('Network error');
    const data = await resp.json();
    const aiDiv = document.createElement('div');
    aiDiv.className = 'border rounded p-2 bg-light ai-md-box';
    aiDiv.innerHTML = renderMarkdown(data.response);
    resultDiv.appendChild(aiDiv);
    addCopyButton(aiDiv, data.response);
    if (window.hljs) { aiDiv.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block)); }
  } catch (e) {
    resultDiv.innerHTML = `<div class='text-danger'>Error: ${escapeHtml(e.message)}</div>`;
  } finally {
    document.getElementById('groq-story-loading').style.display = 'none';
  }
}

// --- Groq Code Explainer ---
async function sendGroqCodeExplain() {
  const input = document.getElementById('groq-code-input');
  const code = input.value.trim();
  if (!code) return;
  const resultDiv = document.getElementById('groq-code-result');
  resultDiv.innerHTML = '';
  document.getElementById('groq-code-loading').style.display = '';
  try {
    const resp = await fetch('/api/groq_code_explain/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({code: code})
    });
    if (!resp.ok) throw new Error('Network error');
    const data = await resp.json();
    const aiDiv = document.createElement('div');
    aiDiv.className = 'border rounded p-2 bg-light ai-md-box';
    aiDiv.innerHTML = renderMarkdown(data.response);
    resultDiv.appendChild(aiDiv);
    addCopyButton(aiDiv, data.response);
    if (window.hljs) { aiDiv.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block)); }
  } catch (e) {
    resultDiv.innerHTML = `<div class='text-danger'>Error: ${escapeHtml(e.message)}</div>`;
  } finally {
    document.getElementById('groq-code-loading').style.display = 'none';
  }
}

// --- Utility: Escape HTML ---
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
  });
}

// --- Load Marked.js and highlight.js for markdown/code rendering ---
if (!window.marked) {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  document.head.appendChild(s);
}
if (!window.hljs) {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/common.min.js';
  document.head.appendChild(s);
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css';
  document.head.appendChild(l);
}
