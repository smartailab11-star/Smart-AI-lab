const messagesEl = document.getElementById('messages');
const form = document.getElementById('inputForm');
const input = document.getElementById('userInput');

function appendMessage(text, who='bot'){
  const el = document.createElement('div');
  el.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
  el.innerHTML = text.replace(/\n/g,'<br>');
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  appendMessage(text,'user');
  input.value = '';
  appendMessage('Thinking...','bot');
  try {
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ prompt: text })
    });
    const data = await res.json();
    const last = messagesEl.querySelector('.msg.bot:last-child');
    if(last && last.textContent === 'Thinking...') last.remove();
    if(data.reply) appendMessage(data.reply,'bot');
    else appendMessage('No reply from server.','bot');
  } catch(err){
    const last = messagesEl.querySelector('.msg.bot:last-child');
    if(last && last.textContent === 'Thinking...') last.remove();
    appendMessage('Error contacting server.','bot');
    console.error(err);
  }
});