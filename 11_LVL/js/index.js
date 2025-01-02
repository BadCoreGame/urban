//функции
  // вывод сообщения
function windowMessage(userName, message) {
  const messageContainer = document.getElementById('messages');
  if (messageContainer) {
    const messageElement = document.createElement('article');
    const messageUser = document.createElement('p');
    const messageData = document.createElement('pre');   
    const user = document.getElementById('userName').textContent;
    
    messageElement.classList.add('message');
    if (userName === user) {messageElement.classList.add('my');}
    else if (userName === 'SeRvEr') {
      messageElement.classList = 'server';
      userName = '';
    }
    
    messageUser.textContent = userName;
    messageData.textContent = message;
    
    messageContainer.appendChild(messageElement);
    messageElement.appendChild(messageUser);
    messageElement.appendChild(messageData);
    
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}
  // отправка сообщения
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const userName = document.getElementById('userName').textContent;
  const message = messageInput.value;
  if (message) {
    wsocket.send(JSON.stringify({mode: "send-message", info: {userName, message}}))
    messageInput.value = '';
  }
};



//соединение webSocket
const wsocket = new WebSocket('ws://192.168.0.89:8080');
  //при соединении с сервером
wsocket.addEventListener('open', function(event) {
  console.log('Connected to the server');
});
  //принятия сообщения
wsocket.addEventListener('message', function(event) {
  const json = JSON.parse(event.data);
  switch (json.mode) {
    case 'message': windowMessage(json.info.userName, json.info.message); break;
    default: console.log('Unknown mode client');
  }
});
  //ошибки
wsocket.addEventListener('error', function(event) {
  console.log(`Error ws`);
  alert('а сервер работает?')
});


//кнопки, события
  //кнопка отправки сообщения
  // textarea ( enter=отправка и shift+enter=новая_строка)
//надеюсь меня не найдут :-)
function insertCodeIntoContainer() {
  // Находим элемент с id "container"
  const container = document.getElementById('container');

  // Проверяем, существует ли элемент с id "container"
  if (container) {
      // Создаем новый элемент div
      const newDiv = document.createElement('div');

      // Устанавливаем innerHTML нового div с нужным HTML-кодом
      newDiv.innerHTML = `
          <div id="input">
              <textarea id="messageInput" placeholder="Type a message"></textarea>
              <button class="btn" id="sendButton" onclick="sendMessage()">Send</button>
          </div>
      `;

      // Вставляем новый div в конец контейнера
      container.appendChild(newDiv);
  }
}
function textarean() {
  const textarea = document.getElementById('messageInput');
  textarea.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
      } else if (event.key === 'Enter' && event.shiftKey) {
          event.preventDefault();
          document.execCommand('insertLineBreak');
      }
  });
}
document.getElementById('sendButtonAU').addEventListener('click', function() {
  if (document.getElementById('userNamed').value) {
    document.getElementById('userName').textContent = document.getElementById('userNamed').value;
    document.getElementById('inputAU').remove();
    document.getElementById('messages').style.display = 'flex';
    insertCodeIntoContainer();
    textarean();
  }
});