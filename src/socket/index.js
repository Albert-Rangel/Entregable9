import messagesEvents from "./messagesEvents.js"
import produtsEvents from "./productsEvents.js"
import cartsEvents from "./cartsEvents.js"

const socketEvents = (socketServer) =>{
    messagesEvents(socketServer);
    produtsEvents(socketServer)
    cartsEvents(socketServer)
}

export default socketEvents
