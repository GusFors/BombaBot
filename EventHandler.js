'use strict'

class EventHandler {
  client

  constructor(client) {
    console.log('EventHandler created')
    this.client = client
    this.startEventListener()
  }

  startEventListener() {
    this.client.on('messageCreate', this.onMessage)
  }

  async onMessage(message) {
    if (message.author.bot) return

    console.log(message.cleanContent)
    message.reply('testing reply')
    console.log('ää')
  }
}

module.exports = EventHandler
