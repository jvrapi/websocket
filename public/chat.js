const socket = io()

const urlSearch = new URLSearchParams(window.location.search)
const username = urlSearch.get('username')
const room = urlSearch.get('select_room')


// emit => emitir alguma informação
// on => escutando alguma informação
// emit e on podem ser usado tanto no lado do cliente como no servidor
socket.emit('select_room', { username, room }, messages => {
  messages.forEach(message => createMessage(message));
})


const usernameDiv = document.getElementById('username')
usernameDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`

document.getElementById('message_input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const message = event.target.value

    const data = {
      room,
      message,
      username
    }

    socket.emit('message', data)

    event.target.value = ''
  }
})


socket.on('message', (message) => {
  createMessage(message)
})

function createMessage({ username, text, createdAt }) {
  const messageDiv = document.getElementById('messages');
  messageDiv.innerHTML += `
  <div class="new_messages">
    <label class="form-label">
      <strong>${username}</strong> <span>${text} - ${dayjs(createdAt).format("DD/MM HH:mm")}</span>
    </label>
  </div>
`
}

document.getElementById('logout').addEventListener('click', event => {
  window.location.href = "index.html"
})