export default function handler(req, res) {
  // Handle GET request - serve chat interface
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Insurance Chatbot</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f7f7f7;
      margin: 0;
      padding: 0;
      display: flex;
      height: 100vh;
      align-items: center;
      justify-content: center;
    }
    #chat-container {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      height: 80%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    #messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
    }
    .message {
      margin: 8px 0;
      padding: 8px 12px;
      border-radius: 16px;
      max-width: 80%;
      line-height: 1.4;
    }
    .message.user {
      background: #daf1da;
      align-self: flex-end;
    }
    .message.bot {
      background: #f1f1f1;
      align-self: flex-start;
    }
    #input-container {
      display: flex;
      border-top: 1px solid #eee;
    }
    #user-input {
      flex: 1;
      border: none;
      padding: 12px;
      font-size: 16px;
    }
    #user-input:focus {
      outline: none;
    }
    #send-btn {
      border: none;
      background: #4a90e2;
      color: white;
      padding: 0 16px;
      cursor: pointer;
      font-size: 16px;
    }
    #send-btn:active {
      background: #357abd;
    }
  </style>
</head>
<body>
  <div id="chat-container">
    <div id="messages"></div>
    <div id="input-container">
      <input id="user-input" type="text" placeholder="Type your question…" autofocus />
      <button id="send-btn">Send</button>
    </div>
  </div>
  <script>
    const messagesEl = document.getElementById('messages');
    const inputEl = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    function appendMessage(text, sender) {
      const el = document.createElement('div');
      el.className = 'message ' + sender;
      el.innerText = text;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    
    async function sendMessage() {
      const userText = inputEl.value.trim();
      if (!userText) return;
      appendMessage(userText, 'user');
      inputEl.value = '';
      appendMessage('…thinking…', 'bot');
      
      try {
        const res = await fetch('/api/generate-recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'You are an insurance advisor.' },
              { role: 'user', content: userText }
            ]
          })
        });
        const data = await res.json();
        
        const thinking = document.querySelector('.message.bot:last-child');
        if (thinking && thinking.innerText === '…thinking…') {
          thinking.remove();
        }
        
        appendMessage(data.reply || 'Sorry, something went wrong.', 'bot');
      } catch (err) {
        console.error(err);
        appendMessage('Error connecting to server.', 'bot');
      }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });
  </script>
</body>
</html>
    `);
    return;
  }

  // Handle POST request - API endpoint
  if (req.method === 'POST') {
    res.status(200).json({ message: "API is live - but you need to implement the AI logic here!" });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
