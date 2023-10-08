import { messagesModel } from "../dao/models/messages.model.js"

const messagesEvents = (socketServer) => {

    socketServer.on('connection', async (socket) => {
        console.log(`client connected with id ${socket.id}`)
        socket.on('message', async (data) => {
            await messagesModel.create(data)
            const messag = await messagesModel.find().lean()
            socketServer.emit('newMessage', messag)
        })
    })

}

export default messagesEvents