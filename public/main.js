const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const responseBox = document.getElementById('response');
const usageEl = document.getElementById('usage');
const modeSel = document.getElementById('mode');

const questBox = document.getElementById('questBox');
const nextQuestBtn = document.getElementById('nextQuest');
const questNote = document.getElementById('questNote');
const saveNoteBtn = document.getElementById('saveNote');
const historyBox = document.getElementById('history');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const proLink = document.getElementById('proLink');

// Stripe/LemonSqueezy link placeholder (set in index.html)
proLink.href = window.AURA_PRO_LINK || '#';

const DAILY_LIMIT = 5;

function getUsage(){
  const today = new Date().toDateString();
  const data = JSON.parse(localStorage.getItem('aura_usage') || '{}');
  if(data.date !== today){ return { date: today, count: 0 }; }
  return data;
}

function setUsage(u){
  localStorage.setItem('aura_usage', JSON.stringify(u));
}

function incrementUsage(){
  const usage = getUsage();
  usage.count++;
  usage.date = new Date().toDateString();
  setUsage(usage);
}

function remainingUses(){
  const usage = getUsage();
  return Math.max(0, DAILY_LIMIT - usage.count);
}

function updateUsageUI(){
  usageEl.textContent = `💬 Free uses left today: ${remainingUses()} / ${DAILY_LIMIT}`;
}

// Quests
const QUESTS = [
  'Give one sincere compliment to a stranger today (outfit, vibe, or energy). Keep it short and natural.',
  'Ask a cashier or barista how their day is going. Follow up with one curious question.',
  'Text a friend you haven’t spoken to in a while. Reconnect with one specific memory.',
  'At the gym, ask someone how they like a machine/exercise you haven’t used before.',
  'During a date or convo, ask one playful question: “What’s your most oddly specific ick?”',
  'Practice confident body language for 3 minutes: shoulders back, slower pace, deep breath.',
  'Open with a light observational comment in public (weather, music, dog breed, etc.).',
  'Share a micro-story about your day in 20 seconds, with one feeling word.'
];

function randomQuest(){
  const i = Math.floor(Math.random() * QUESTS.length);
  return QUESTS[i];
}

function renderHistory(){
  const data = JSON.parse(localStorage.getItem('aura_history') || '[]');
  if (!data.length){ historyBox.innerText = 'No quest logs yet.'; return; }
  historyBox.innerHTML = '<b>Your Quest Logs:</b><br><br>' + data.map((d,i)=>`#${i+1} — ${new Date(d.ts).toLocaleString()}<br>${d.quest}<br><i>Note:</i> ${d.note}`).join('<br><br>');
}

nextQuestBtn.onclick = ()=>{
  questBox.innerText = randomQuest();
};
saveNoteBtn.onclick = ()=>{
  const quest = questBox.innerText || '(no quest shown)';
  const note = questNote.value.trim();
  if(!note){ alert('Write a short note first.'); return; }
  const data = JSON.parse(localStorage.getItem('aura_history') || '[]');
  data.push({ ts: Date.now(), quest, note });
  localStorage.setItem('aura_history', JSON.stringify(data));
  questNote.value='';
  renderHistory();
};

sendBtn.onclick = async ()=>{
  if(remainingUses() <= 0){
    responseBox.innerHTML = "💘 You've used all 5 free sessions today.<br><br>Upgrade to <b>AURA Pro</b> for unlimited coaching.";
    modal.classList.remove('hidden');
    return;
  }

  const text = userInput.value.trim();
  if(!text){ alert('Paste a message or describe your situation.'); return; }
  responseBox.innerText = 'Thinking…';
  const mode = modeSel.value;

  try{
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ input: text, mode })
    });
    const data = await res.json();
    if(data.error){ responseBox.innerText = 'Error: ' + data.error; return; }
    incrementUsage();
    responseBox.innerText = data.advice;
    updateUsageUI();
  }catch(e){
    responseBox.innerText = 'Network error. Try again.';
  }
};

closeModal.onclick = ()=> modal.classList.add('hidden');

// init
questBox.innerText = randomQuest();
renderHistory();
updateUsageUI();
