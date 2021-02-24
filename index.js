const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })
const tokens = []

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    if (tokens.includes(message)) return
    console.log(`토큰 갖고옴: \n ${message}`)
    tokens.push(message)
  })
})
