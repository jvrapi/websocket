import { io } from './http'

interface RoomUser {
  socket_id: string
  username: string
  room: string
}

interface Message {
  room: string
  username: string
  text: string
  createdAt: Date
}

const users: RoomUser[] = []

const messages: Message[] = []

io.on('connection', socket => {
  socket.on('select_room', ({ room, username }, callback) => {
    socket.join(room)
    const userInRoom = users.find(user => user.username === username && user.room === room)

    /*
      se ja existir o usuário, so altera o socket id       
      se não, insere o usuário no array
    */

    if (userInRoom) {
      userInRoom.socket_id = socket.id
    } else {
      users.push({
        room: room,
        username: username,
        socket_id: socket.id
      })
    }
    const messagesRoom = getMessagesRoom(room);
    callback(messagesRoom)
  })

  socket.on('message', ({ room, username, message }) => {
    // Salvar as mensagens 
    const newMessage: Message = {
      room,
      username,
      text: message,
      createdAt: new Date()
    }

    messages.push(newMessage)

    // Enviar para os usuários da sala
    io.to(room).emit('message', newMessage)
  })
})


function getMessagesRoom(room: string) {
  const messagesRoom = messages.filter(message => message.room === room);
  return messagesRoom
}